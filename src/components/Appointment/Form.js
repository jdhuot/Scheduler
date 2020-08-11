import React, { useState } from 'react';
import Button from '../Button';
import InterviewerList from '../InterviewerList';


export default function Form(props) {
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

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

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    props.onSave(name, interviewer);
    setError("");
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            value={name}
            type="text"
            placeholder={props.name ? props.name : "Enter Student Name"}
            onChange={e => setName(e.target.value)}
            data-testid="student-name-input"
            /*
              This must be a controlled component
            */
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={e => cancel(e)} >Cancel</Button>
          {/* <Button confirm onClick={e => props.onSave(name, interviewer)} >Save</Button> */}
          <Button confirm onClick={e => validate()} >Save</Button>
        </section>
      </section>
    </main>
  );
};