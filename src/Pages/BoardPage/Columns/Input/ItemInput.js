import React, { useState, useContext } from 'react';
import { Paper, InputBase, Button, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles, fade } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
  item: {
    width: '280px',
    margin: theme.spacing(0, 1, 1, 1),
    paddingBottom: theme.spacing(4),
  },
  input: {
    margin: theme.spacing(1),
  },
  btnConfirm: {
    background: '#5AAC44',
    color: '#fff',
    '&:hover': {
      background: fade('#5AAC44', 0.75),
    },
  },
  confirm: {
    margin: theme.spacing(0, 1, 1, 1),
  },
}));
function ItemInput({ setOpen, curUser, boardId ,colId, type }) {
  const classes = useStyle();
  const [title, setTitle] = useState('');

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleBtnConfirm = () => {
    if (type === 'item') {
      fetch("https://api-dagk-webnc.herokuapp.com/api/item/createItem/",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
        body: JSON.stringify( {
            id_board:boardId,
            id_column:colId,
            description: title
        })
    }).then(window.location.reload());
      setTitle('');
      setOpen(false);
    } else {
      console.log('creating column');
      fetch("https://api-dagk-webnc.herokuapp.com/api/column/createColumn/",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${curUser.token}` },
        body: JSON.stringify( {
            id_board:boardId,
            name: title
        })
        }).then(window.location.reload());
      setTitle('');
      setOpen(false);
    }
  };

  return (
    <div>
      <div>
        <Paper className={classes.item}>
          <InputBase
            onChange={handleOnChange}
            multiline
            onBlur={() => setOpen(false)}
            fullWidth
            inputProps={{
              className: classes.input,
            }}
            value={title}
            placeholder={
              type === 'item'
                ? 'Enter description of this item...'
                : 'Enter column title...'
            }
          />
        </Paper>
      </div>
      <div className={classes.confirm}>
        <Button className={classes.btnConfirm} onClick={handleBtnConfirm}>
          {type === 'item' ? 'Add Item' : 'Add Column'}
        </Button>
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ItemInput;