import React from "react";

export const FormButtons = ({
  formType,
  isEditing,
  onEdit,
  onCancelEdit,
  buttons
}) => {
  if (formType && isEditing) {
    return (
      <div className="col-12 d-flex justify-content-center gap-3">
        <button className="btn btn-primary">
          Guardar
        </button>
        <button className="btn btn-danger text-white" onClick={onCancelEdit}>
          Cancelar
        </button>
      </div>
    );
  }
  if (formType && !isEditing) {
    return (
      <div className="col-12 d-flex justify-content-center gap-3">
        <button className="btn btn-warning" onClick={onEdit}>
          Editar
        </button>
      </div>
    );
  }
  if (!formType && !isEditing) {
    return (
      <div className="col-12 d-flex justify-content-center gap-3">
        <button className="btn btn-primary">
          {buttons[0].label}
        </button>
      </div>
    );
  }
};
