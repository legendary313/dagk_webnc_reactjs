import './AccountPage.css';
import React,{ useState, useEffect} from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import swal from "sweetalert";
import { Formik, Field, Form, ErrorMessage } from 'formik';


const userInfoSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname  is required'),
    lastName: Yup.string().required('Lastname is required')
});


function AccountPage(props) {
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [editModalState, setEditModalState] = useState(false)
  const toggleEditModalState = () => {
    setEditModalState(!editModalState)
  }

  
  const submitEditForm = (values, history) => {
    fetch("https://api-dagk-webnc.herokuapp.com/api/user/updateUser/"+currentUser.id,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${currentUser.token}` },
    body: JSON.stringify( {firstName: values.firstName,
      lastName: values.lastName})
})
.then(res => {
    if (res.status === 200) {
      currentUser.firstName=values.firstName;
      currentUser.lastName=values.lastName;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    swal("Success! User updated").then(value => {
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
const showEditForm = ({values,errors,touched,handleChange,handleSubmit,setFieldValue,isSubmitting}) => {
return (
    <form onSubmit={handleSubmit}>
    <div className="form-group has-feedback">
    <input type="text" name="firstName" onChange={handleChange}   className="form-control"
        placeholder="Your first name" value={values.firstName}  className={
        errors.firstName && touched.firstName
            ? "form-control is-invalid"
            : "form-control"}/>
    </div>
    <div className="form-group has-feedback">
    <input
        type="text" name="lastName" onChange={handleChange} 
        className="form-control"  placeholder="Your last name" value={values.lastName} 
        className={
        errors.lastName && touched.lastName
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
     <div className='col-md-6'>
          <h1>Your Information</h1>
          <p>First name: {currentUser.firstName}</p>
          <p>Last name: {currentUser.lastName}</p>
      </div>
      
      <Button onClick={() => toggleEditModalState()} variant="secondary" size="sm" margin="5px">Update</Button>
     

      <div className={`modalBackground modalShowing-${editModalState}`}>
              <div className="modalInner" >
                <div className="modalText" >
                  <h2>Update account informations</h2>
                    <Formik
                          initialValues={{
                          firstName: currentUser.firstName,
                          lastName: currentUser.lastName}}
                          onSubmit={(values, { setSubmitting }) => {
                          const valueEditBoard = {firstName: values.firstName,
                          lastName:values.lastName};
                          submitEditForm(valueEditBoard, props.history);
                          setSubmitting(false);
                          }}
                          validationSchema={userInfoSchema}>
                          {props => showEditForm(props)}
                    </Formik>
                    <button style={{marginTop:'5px'}} className="btn btn-light btn-block btn-flat" onClick={() => toggleEditModalState()}>
                    Exit
                  </button>
                </div>
              </div>
            </div>
    </div>
    
  );
}

export default AccountPage;