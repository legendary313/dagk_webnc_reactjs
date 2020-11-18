import './Board.css';
import React,{ useState, useEffect} from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import swal from "sweetalert";
import { Formik, Field, Form, ErrorMessage } from 'formik';


const boardSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required')
});


function Board(props) {
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [editModalState, setEditModalState] = useState(false)
  
  const toggleEditModalState = () => {
    setEditModalState(!editModalState)
  }

  const [delModalState, setDelModalState] = useState(false)
  
  const toggleDelModalState = () => {
    setDelModalState(!delModalState)
  }

  const deleteBoard = () => {fetch("https://api-dagk-webnc.herokuapp.com/api/board/deleteBoard/"+props.value._id,{
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${currentUser.token}` },
    }).then(res => {
      if (res.status === 200) {
      swal("Success! Board deleted").then(value => {
          window.location.reload();
      });
      } else if (res.status === 500) {
      swal("Error! Delete failed!");
      }
  })
  .catch(error => {
      console.log(error);
      swal("Error!", "Unexpected error", "error");
  });
  };

  
  const submitEditForm = (values, history) => {
    fetch("https://api-dagk-webnc.herokuapp.com/api/board/updateBoard/"+props.value._id,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${currentUser.token}` },
    body: JSON.stringify( {name: values.name,
      description: values.description})
})
.then(res => {
    if (res.status === 200) {
    swal("Success! Board updated").then(value => {
        window.location.reload();
    });
    } else if (res.status === 500) {
    swal("Error! Update failed!");
    }
})
.catch(error => {
    console.log(error);
    swal("Error!", "Unexpected error", "error");
});
};
console.log(props.value._id);
const showEditForm = ({values,errors,touched,handleChange,handleSubmit,setFieldValue,isSubmitting}) => {
return (
    <form onSubmit={handleSubmit}>
    <div className="form-group has-feedback">
    <input type="text" name="name" onChange={handleChange}   className="form-control"
        placeholder="Board name" value={values.name}  className={
        errors.name && touched.name
            ? "form-control is-invalid"
            : "form-control"}/>
    </div>
    <div className="form-group has-feedback">
    <input
        type="text" name="description" onChange={handleChange} 
        className="form-control"  placeholder="Board description" value={values.description} 
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
        Update
        </button>
    </div>
    </div>
</form>
);
};

  return (
    <div>
     
      <Card  className = 'Board' style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title className = 'Title'>{props.value.name}</Card.Title>
            <Card.Text>
              {props.value.description}
            </Card.Text>
            <Link to= {'/board/' + props.value._id}>
              <Button variant="success" size="sm" margin="5px">Go to board</Button>
            </Link>
          <Button onClick={() => toggleEditModalState()} variant="light" size="sm" margin="5px">Edit</Button>
          <Button onClick={() => toggleDelModalState()} variant="danger" size="sm" margin="5px">Delete</Button>
        </Card.Body>
      </Card>

      <div className={`modalBackground modalShowing-${editModalState}`}>
              <div className="modalInner" >
                <div className="modalText" >
                  <h2>Edit board informations</h2>
                    <Formik
                          initialValues={{
                          name: props.value.name,
                          description:props.value.description}}
                          onSubmit={(values, { setSubmitting }) => {
                          const valueEditBoard = {name: values.name,
                          description:values.description};
                          submitEditForm(valueEditBoard, props.history);
                          setSubmitting(false);
                          }}
                          validationSchema={boardSchema}>
                          {props => showEditForm(props)}
                    </Formik>
                    <button style={{marginTop:'5px'}} className="btn btn-light btn-block btn-flat" onClick={() => toggleEditModalState()}>
                    Exit
                  </button>
                </div>
              </div>
            </div>

            <div className={`modalBackground modalShowing-${delModalState}`}>
              <div className="modalInner" >
                <div className="modalText" >
                  <h2>Are you sure to delete this board?</h2>
                  <button style={{marginTop:'5px'}} className="btn btn-danger btn-block btn-flat" onClick={() => deleteBoard()}>
                    Delete this board
                  </button>
                    <button style={{marginTop:'5px'}} className="btn btn-light btn-block btn-flat" onClick={() => toggleDelModalState()}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
    </div>
    
  );
}

export default Board;