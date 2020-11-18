import React, { useState, useContext, useEffect } from 'react';
import { Typography, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import swal from "sweetalert";
import { Button } from 'react-bootstrap';
const useStyle = makeStyles((theme) => ({
    editableTitleContainer: {
      margin: theme.spacing(1),
      display: 'flex',
    },
    editableTitle: {
      flexGrow: 1,
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    input: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      margin: theme.spacing(1),
      '&:focus': {
        background: '#ddd',
      },
    },
  }));

function ColTitle({ title, colId, curUser}){  
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const classes = useStyle();
    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    };

    const deleteColumn = () =>{fetch("https://api-dagk-webnc.herokuapp.com/api/column/deleteColumn/"+colId,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
        }).then(res => {
          if (res.status === 200) {
          swal("Success! Column deleted").then(value => {
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

    const handleOnBlur = () => {
        fetch("https://api-dagk-webnc.herokuapp.com/api/column/updateColumn/"+colId,{
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
            body: JSON.stringify( {name: newTitle})
        }).then(res =>{
            if(res.status === 200)
            window.location.reload();});
        setOpen(false);
    };

    return (
        <div>
        {open ? (
            <div>
            <InputBase
                onChange={handleOnChange}
                autoFocus
                value={newTitle}
                inputProps={{
                className: classes.input,
                }}
                fullWidth
                onBlur={handleOnBlur}
            />
            </div>
        ) : (
            <div className={classes.editableTitleContainer}>
            <Typography
                onClick={() => setOpen(!open)}
                className={classes.editableTitle}
            >
                {title}
            </Typography>
            <Button variant="danger">
                <DeleteIcon  elevation={0} onClick={() => deleteColumn()}  />
            </Button>
            </div>
        )}
        </div>
    );
}
export default ColTitle;