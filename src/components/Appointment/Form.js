import React, { useState } from 'react';
import Button from '../Button';
import InterviewerList from '../InterviewerList';


export default function Form(props) {
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = function(e) {
    setName("");
    e.target.value="";
    setInterviewer(null);
    props.onCancel();
  }
  const cancel = function(e) {
    props.onCancel();
    reset(e);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            type="text"
            placeholder={props.name ? props.name : "Enter Student Name"}
            onChange={e => setName(e.target.value)}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={e => cancel(e)} >Cancel</Button>
          <Button confirm onClick={e => props.onSave(name, interviewer)} >Save</Button>
        </section>
      </section>
    </main>
  );
};