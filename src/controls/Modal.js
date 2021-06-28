import React from "react";

const Modal = React.forwardRef((props, ref) => {
  const { title, onCancel, onConfirm, confirmButton, cancelButton } = props;

  return (
    <div className="modal black-text" ref={ref}>
      <div className="modal-title">
        <h2 className="center-align"> {title} </h2>{" "}
      </div>
      <div className="modal-content">{props.children}</div>
      <div className="modal-footer">
        <button
          className="modal-close waves-effect waves-red btn-flat"
          onClick={onCancel}
        >
          {cancelButton}
        </button>
        <button
          className="modal-close waves-effect waves-green btn-flat"
          onClick={onConfirm}
        >
          {confirmButton}
        </button>
      </div>
    </div>
  );
});

export default Modal;
