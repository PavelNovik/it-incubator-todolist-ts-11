import React, {ChangeEvent, memo, useCallback, useMemo} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task";
import {TaskWithRedux} from "./TaskWithRedux";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.id, props.addTask])

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [])
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), []);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), []);


    const removeTask = useCallback((id: string) => props.removeTask(id, props.id), [props.removeTask, props.id])
    const changeTaskStatus = useCallback((newIsDoneValue: boolean, id: string) => {
        props.changeTaskStatus(id, newIsDoneValue, props.id);
    }, [props.changeTaskStatus, props.id])
    const changeTaskTitle = useCallback((newValue: string, id: string) => {
        props.changeTaskTitle(id, newValue, props.id);
    }, [props.changeTaskTitle, props.id])

    let allTodolistTasks = props.tasks;
    let tasksForTodolist = allTodolistTasks;

    useMemo(() => {
        if (props.filter === "active") {
            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
        }
        if (props.filter === "completed") {
            tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
        }

    }, [props.filter]);


    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map(t => {
                    // const onClickHandler = () => props.removeTask(t.id, props.id)
                    // const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                    //     let newIsDoneValue = e.currentTarget.checked;
                    //     props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    // }
                    // const onTitleChangeHandler = (newValue: string) => {
                    //     props.changeTaskTitle(t.id, newValue, props.id);
                    // }
                    // return <Task key={t.id} task={t} changeTaskStatus={changeTaskStatus}
                    //              removeTask={removeTask} changeTaskTitle={changeTaskTitle}/>

                    return <TaskWithRedux key={t.id} task={t} todolistId={props.id}/>

                    // return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                    //     <Checkbox
                    //         checked={t.isDone}
                    //         color="primary"
                    //         onChange={onChangeHandler}
                    //     />
                    //
                    //     <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                    //     <IconButton onClick={onClickHandler}>
                    //         <Delete/>
                    //     </IconButton>
                    // </div>
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <MyButton variant={props.filter === 'all' ? 'outlined' : 'text'}
                      onClick={onAllClickHandler}
                      color={'inherit'} text={'All'}
            />

            <MyButton variant={props.filter === 'active' ? 'outlined' : 'text'}
                      onClick={onActiveClickHandler}
                      color={'primary'} text={'Active'}/>

            <MyButton variant={props.filter === 'completed' ? 'outlined' : 'text'}
                      onClick={onCompletedClickHandler}
                      color={'secondary'} text={'Completed'}/>

        </div>
    </div>
})

type MyButtonPropsType = {
    variant: 'outlined' | 'text'
    onClick: () => void
    color: 'inherit' | 'primary' | 'secondary'
    text: string
}

const MyButton = memo((props: MyButtonPropsType) => {
    return <Button variant={props.variant}
                   onClick={props.onClick}
                   color={props.color}
    >{props.text}
    </Button>
})

