import React, { useState, useEffect } from 'react';
import {Typography, InputBase} from '@material-ui/core'
import Column from './Columns/Column';
import './Board.css';
import { Container, Row, Col} from 'react-bootstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import InputObj from './Columns/Input/InputObj';

function BoardPage(props){  
    console.log(props.match.params.id);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [listCols,setListCols] = useState([]);
    
    const currentBoardID = props.match.params.id;
    useEffect(() => {
        fetch("https://api-dagk-webnc.herokuapp.com/api/column/getColumnsbyBoardID/"+currentBoardID,{
            method: 'GET',
            headers: { Authorization: `Bearer ${currentUser.token}`},
        })
            .then(response => response.json())
            .then(res => setListCols(res));
            }, []);
            console.log(listCols);
    
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        console.log('destination', destination, 'source', source, draggableId);
    
        if (!destination) {
            return;
        }
        else{
           
            
            if (source.droppableId !== destination.droppableId) {
                fetch("https://api-dagk-webnc.herokuapp.com/api/item/updateItemBoard/"+draggableId,{
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${currentUser.token}` },
                    body: JSON.stringify( {
                        id_column: destination.droppableId})
                }).then(res=>{
                    if(res.status === 200)
                    window.location.reload();
                });
            }
        }
    };
            
    
    return(
        <div >
            <DragDropContext onDragEnd={onDragEnd}>
                <Container>
                    <Col className='col-md-12'>
                            <InputObj curUser={currentUser} boardId={currentBoardID} colId={null} type="column" />
                    </Col>
                    <Row>   
                    {listCols && listCols.map(col => (
                        <Col key={col._id}>
                            <Column key={col._id}  value ={col} />
                        </Col>
                    ))} 
                    </Row>
                    
                </Container>
            </DragDropContext>
        </div>
    )
 }
export default BoardPage;