import React,{useState} from 'react';
import { Paper, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@material-ui/icons/Delete';
import swal from "sweetalert";
import { Button } from 'react-bootstrap';

const useStyle = makeStyles((theme) => ({
    item: {
      padding: theme.spacing(1, 1, 1, 2),
      margin: theme.spacing(1),
    },
    input: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      margin: theme.spacing(1),
      '&:focus': {
        background: 'white',
      },
    },
}));

function Item({ item, curUser,index }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(item.description);
  console.log(item);

  const handleOnChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleOnBlur = () => {
    if(newDescription !== item.description){
    fetch("https://api-dagk-webnc.herokuapp.com/api/item/updateItem/"+item._id,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
        body: JSON.stringify( {id_column: item.id_column,
        description: newDescription})
    }).then(res=>{
      if (res.status === 200) {
        window.location.reload();
      }
    })}
    setOpen(false);
  };

  const deleteItem = () =>{fetch("https://api-dagk-webnc.herokuapp.com/api/item/deleteItem/"+item._id,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
        }).then(res => {
          if (res.status === 200) {
          swal("Success! Item deleted").then(value => {
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

  return (
    <div>
       {open ? (
            <div>
            <InputBase
                onChange={handleOnChange}
                autoFocus
                value={newDescription}
                inputProps={{
                className: classes.input,
                }}
                fullWidth
                onBlur={handleOnBlur}
            />
            </div>
        ) : (
          <div>
        <Draggable draggableId={item._id} index={0}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              
              <Paper onClick={() => setOpen(!open)} className={classes.item}> <Button variant="light" size="sm">
                <DeleteIcon  elevation={0} onClick={() => deleteItem()}  />
              </Button>{item.description}</Paper>
              
            </div>
          )}
        </Draggable>
          
        </div>)}
      </div>
  );
}

export default Item;