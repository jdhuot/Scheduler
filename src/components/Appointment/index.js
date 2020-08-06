import React, { Fragment } from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';


export default function Appointment(props) {
  const display = props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />
  return (
    <>
    <Header time={props.time} />
    {display}
    </>
  );
};