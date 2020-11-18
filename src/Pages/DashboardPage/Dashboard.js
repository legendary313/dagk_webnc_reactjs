import React, { useState, useEffect } from 'react';
import  authenticationService  from '../../Services/Authentication_service';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, CardDeck, CardColumns
  } from 'react-bootstrap';
import './Dashboard.css';
import Board from './Board/Board';
import * as Yup from 'yup';
import swal from "sweetalert";
import { Formik } from 'formik';

const boardSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required')
});

function Dashboard(props){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    const [listBoards,setListBoards] = useState([]);

    useEffect(() => {
        fetch("https://api-dagk-webnc.herokuapp.com/api/board/getBoardsbyUserID/"+currentUser.id,{
            method: 'GET',
            headers: { Authorization: `Bearer ${currentUser.token}`},
        })
            .then(response => response.json())
            .then(res => setListBoards(res));
            }, []);
            console.log(listBoards);
    
const submitForm = (values, history) => {
            fetch("https://api-dagk-webnc.herokuapp.com/api/board/createBoard",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${currentUser.token}`},
            body: JSON.stringify( {id_user:currentUser.id,
            name: values.name,
            description: values.description})
        })
        .then(res => {
            if (res.status === 200) {
            swal("Success! New Board created").then(value => {
                history.push("/");
                window.location.reload();
            });
            } else if (res.status === 500) {
            swal("Error! Create failed!");
            }
        })
        .catch(error => {
            console.log(error);
            swal("Error!", "Unexpected error", "error");
        });
    };

    const showForm = ({values,errors,touched,handleChange,handleSubmit,setFieldValue,isSubmitting}) => {
        return (
            <form onSubmit={handleSubmit}>
            <div className="form-group has-feedback">
            <input type="text" name="name" onChange={handleChange}  value={values.name}  className="form-control"
                placeholder="Board name"   className={
                errors.name && touched.name
                    ? "form-control is-invalid"
                    : "form-control"}/>
            </div>
            <div className="form-group has-feedback">
            <input
                type="text" name="description" onChange={handleChange} value={values.description}
                className="form-control"  placeholder="Board description"
                className={
                errors.description && touched.description
                    ? "form-control is-invalid"
                    : "form-control"
                }
            />
            </div>
            
            <div className="row">
            <div className="col-md-12">
                <button   disabled={isSubmitting} type="submit"
                className="btn btn-primary btn-block btn-flat" >
                Add
                </button>
            </div>
            {/* /.col */}
            </div>
        </form>
        );
    };
    return (
        <div>
            <div className='dashboard row'>
                <div className='col-md-6'>
                    <h1>Hi {currentUser.firstName}!</h1>
                    <p>1712928 - DƯƠNG NGUYÊN TRƯỜNG VỸ!</p>
                    <p>DAGK - WEB NANG CAO!</p>
                </div>
                <div className='col-md-6'>
                    <Card  className = 'addBoard col-md-6  '>
                        <Card.Body  style={{textAlign: 'center',fontstyle:'bold'}} >
                            <Card.Title>Add new board</Card.Title >
                            <Formik
                                initialValues={{
                                name: "",
                                description:""}}
                                onSubmit={(values, { setSubmitting }) => {
                                const valueNewBoard = {name: values.name,
                                description:values.description};
                                submitForm(valueNewBoard, props.history);
                                setSubmitting(false);
                                }}
                                validationSchema={boardSchema}>
                                {props => showForm(props)}
                            </Formik>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div>
            <CardDeck style={{ flexDirection: 'column'}}>
                    <CardColumns>
                    {listBoards && listBoards.map(board => (
                        <Board key = {board._id} value ={board} />
                    ))} 
                    </CardColumns>
            </CardDeck>
            </div>
        </div>
    );
}

export default Dashboard;