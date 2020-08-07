import React, { Fragment } from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from '../../hooks/useVisualMode';


export default function Appointment(props) {
  const display = props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty />
  return (
    <Fragment>
    <Header time={props.time} />
    {display}
    {/* <Appointment id="last" time="1pm" /> */}
    </ Fragment>
  );
};