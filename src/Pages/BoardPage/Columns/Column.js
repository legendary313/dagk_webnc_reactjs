import React, { useState, useEffect } from 'react';
import {Typography, Paper, CssBaseline} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ColTitle from './ColTitle/ColTitle';
import Item from './Items/Item';
import InputObj from './Input/InputObj'
import { Droppable, Draggable } from 'react-beautiful-dnd';

const useStyle = makeStyles((theme) => ({ 
    root: {
        width: '300px',
        backgroundColor: '#EBECF0',
        marginLeft: theme.spacing(1)
    },
    itemContainer: {
        marginTop: theme.spacing(4),
      },
}));
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
function Column(props){  
    const classes = useStyle();
    const [listItems,setListItems] = useState([]);
    useEffect(() => {
        fetch("https://api-dagk-webnc.herokuapp.com/api/item/getItemsbyColumnID/"+props.value._id,{
            method: 'GET',
            headers: { Authorization: `Bearer ${currentUser.token}`},
        })
            .then(response => response.json())
            .then(res => setListItems(res));
            }, []);
            console.log(listItems);

    return(
        <div>
            <Paper className={classes.root}>
                <CssBaseline/> 
                <ColTitle  title={props.value.name} colId={props.value._id} curUser={currentUser}/>
                    <Droppable droppableId={props.value._id}>
                        {(provided) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={classes.itemContainer}
                            >
                            {listItems && listItems.map(item => (
                                <Item key={item._id} item={item} curUser={currentUser}/>
                            ))}
                            {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                <InputObj curUser={currentUser} boardId={props.value.id_board} colId={props.value._id} type="item" />
            </Paper>
        </div>
    )
 }
export default Column;