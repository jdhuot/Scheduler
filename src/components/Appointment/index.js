import React, { Fragment } from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import useVisualMode from '../../hooks/useVisualMode';

export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    const book = 
    (new Promise((resolve, reject) => {
      resolve(props.bookInterview(props.id, interview));
    }))
    .then(() => {
      transition(SHOW);
    })
  }

  return (
    <Fragment>
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
                        <Show
                          student={props.interview.student}
                          interviewer={props.interview.interviewer}
                        />
    )}
    {mode === CREATE && (
                        <Form 
                        interviewers={props.interviewers}
                        onSave={save} 
                        onCancel={() => back()} 
                        bookInterview={props.bookInterview}
                        id={props.id}
                        interview={props.interview}
                        />
    )}
    {mode === SAVING && (
                        <Status 
                        message="Saving..."
                        />
    )}
    {/* <Appointment id="last" time="1pm" /> */}
    </ Fragment>
  );
};