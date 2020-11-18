import React, { useState } from 'react';
import { Paper, Typography, Collapse } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import ItemInput from './ItemInput';

const useStyle = makeStyles((theme) => ({
  root: {
    width: '300px',
    marginTop: theme.spacing(1),
  },
  addItem: {
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(0, 1, 1, 1),
    background: '#EBECF0',
    '&:hover': {
      backgroundColor: fade('#000', 0.25),
    },
  },
}));

function InputObj({ curUser, boardId, colId, type }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <ItemInput setOpen={setOpen} curUser={curUser} boardId={boardId} colId={colId} type={type} />
      </Collapse>
      <Collapse in={!open}>
        <Paper
          className={classes.addItem}
          elevation={0}
          onClick={() => setOpen(!open)}
        >
          <Typography>
            {type === 'item' ? '+ Add a item' : '+ Add another Column'}
          </Typography>
        </Paper>
      </Collapse>
    </div>
  );
}

export default InputObj;