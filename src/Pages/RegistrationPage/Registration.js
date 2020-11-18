import React , { useState, useEffect }from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import swal from "sweetalert";


const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('Lastname is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    checkpassword: Yup.string().required('Confirm password is required').oneOf(
        [Yup.ref("password"),null],
        "Both password need to be the same"
    ),
});

function RegistrationPage(props){   

    const submitForm = (values, history) => {
        fetch("https://api-dagk-webnc.herokuapp.com/api/user/register",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
              firstName: values.firstName,
              lastName: values.lastName,
              username: values.username,
              password: values.password})
        })
          .then(res => {
            if (res.status === 200) {
              swal("Success! New Account created").then(value => {
                history.push("/login");
              });
            } else if (res.status === 500) {
              swal("Error! Username already exist!");
            }
          })
          .catch(error => {
            console.log(error);
            swal("Error!", "Unexpected error", "error");
          });
      };

    const showForm = ({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting
      }) => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group has-feedback">
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={values.firstName}
                className="form-control"
                placeholder="Firstname"
                className={
                  errors.firstName && touched.firstName
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
            </div>
            <div className="form-group has-feedback">
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={values.lastName}
                className="form-control"
                placeholder="Lastname"
                className={
                  errors.lastName && touched.lastName
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
            </div>
            <div className="form-group has-feedback">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={values.username}
                className="form-control"
                placeholder="Username"
                className={
                  errors.username && touched.username
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              {errors.username && touched.username ? (
                <small id="passwordHelp" class="text-danger">
                  {errors.username}
                </small>
              ) : null}
            </div>
            <div className="form-group has-feedback">
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
                className="form-control"
                placeholder="Password"
                className={
                  errors.password && touched.password
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
              {errors.password && touched.password ? (
                <small id="passwordHelp" class="text-danger">
                  {errors.password}
                </small>
              ) : null}
            </div>
            <div className="form-group has-feedback">
              <input
                type="password"
                name="checkpassword"
                onChange={handleChange}
                className={
                  errors.checkpassword && touched.checkpassword
                    ? "form-control is-invalid"
                    : "form-control"
                }
                placeholder="Confirm Password"
              />
              {errors.checkpassword && touched.checkpassword ? (
                <small id="passwordHelp" class="text-danger">
                  {errors.checkpassword}
                </small>
              ) : null}
            </div>
            <div className="row">
              <div className="col-md-12">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary btn-block btn-flat"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    props.history.push("/login");
                  }}
                  className="btn btn-default btn-block btn-flat">
                  already member?
                </button>
              </div>
              {/* /.col */}
            </div>
          </form>
        );
      };


    return (
      <div  className="col-md-6 offset-md-3">
        <div className="register-box">
          <div style={{display: 'flex', justifyContent:'center', alignItems:'center', fontSize:30}}>
              <b>Register</b>
          </div>
          <div className="card">
            <div className="card-body register-card-body">
  
              <Formik
                initialValues={{
                  firstName: "",
                  lastName:"",
                  username:"",
                  password: "",
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const valueNewUser = {firstName: values.firstName,
                  lastName:values.lastName,
                  username:values.username,
                  password: values.password};
                  submitForm(valueNewUser, props.history);
                  setSubmitting(false);
                }}
                validationSchema={SignupSchema}
              >
                {props => showForm(props)}
              </Formik>
            </div>
          </div>
        </div>
        </div>
      );
}

export default RegistrationPage;