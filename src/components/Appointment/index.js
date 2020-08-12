import React, { Fragment, useEffect } from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Error from './Error';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import useVisualMode from '../../hooks/useVisualMode';

export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const DELETING = "DELETING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    
    if(mode === 'EDIT') {
      props
      .editInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
    } else {
      props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
    }
  }

  function deleteInterview(id) {
    transition(DELETING, true);

    props
     .cancelInterview(id)
     .then(() => transition(EMPTY))
     .catch(error => transition(ERROR_DELETE, true));
  }

  useEffect(() => { 

    if (mode === 'EMPTY' && props.interview) {
      transition(SHOW);
     }
     if (mode === 'SHOW' && props.interview === null) {
      transition(EMPTY);
     }
  },[props.interview, transition, mode]);

  return (
    <Fragment>
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview && (
                        <Show
                          student={props.interview.student}
                          interviewer={props.interview.interviewer}
                          onDelete={e => transition(CONFIRM)}
                          onEdit={e => transition(EDIT)}
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
    {mode === EDIT && (
                        <Form 
                        interviewers={props.interviewers}
                        onSave={save} 
                        name={props.interview.student}
                        onCancel={() => back()} 
                        bookInterview={props.editInterview}
                        id={props.id}
                        interview={props.interview}
                        interviewer={props.interview.interviewer.id}
                        />
    )}
    {mode === SAVING && (
                        <Status 
                        message="Saving..."
                        />
    )}
    {mode === DELETING && (
                        <Status 
                        message="Deleting..."
                        />
    )}
    {mode === ERROR_DELETE && (
                        <Error 
                        message="Could not delete appointment"
                        onClose={() => back()} 
                        />
    )}
    {mode === ERROR_SAVE && (
                        <Error 
                        message="Could not save appointment"
                        onClose={() => back()} 
                        />
    )}
    {mode === CONFIRM && (
                        <Confirm 
                        message="Delete the appointment?"
                        onConfirm={() => deleteInterview(props.id)}
                        onCancel={() => back()} 
                        />
    )}
    </ Fragment>
  );
};