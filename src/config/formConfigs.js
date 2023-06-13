const loginForm = {
  formName: "loginForm",
  formEditable: 0,
  columns: 2,
  getData: "",
  formFields: [
    {
      label: "Email",
      nameBD: "email",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "email",
      placeholder: "Email",
      minLength: "3",
      maxLength: "40",
      min: "",
      max: "",
    },
    {
      label: "Contraseña",
      nameBD: "password",
      type: "password",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "Contraseña",
      minLength: "6",
      maxLength: "18",
      min: "",
      max: "",
    },
  ],
  formButtons: [
    {
      label: "Ingresar",
      type: "primary",
      action: "",
    },
  ],
};

const searchCarForm = {
  formName: "searchCarForm",
  formEditable: 0,
  columns: 1,
  getData: "",
  formFields: [
    {
      label: "",
      nameBD: "plate",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "Matrícula",
      minLength: "5",
      maxLength: "9",
      min: "",
      max: "",
    }
  ],
  formButtons: [
    {
      label: "Buscar",
      type: "primary",
      action: "",
    },
  ],
};

const createCarForm = {
  formName: "createCarForm",
  formEditable: 0,
  formFields: [
    {
      label: "Matrícula",
      nameBD: "plate",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "Matrícula",
      minLength: "6",
      maxLength: "10",
      min: "",
      max: "",
    },
    {
      label: "Marca",
      nameBD: "brand",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "",
      minLength: "1",
      maxLength: "30",
      min: "",
      max: "",
    },
    {
      label: "Modelo",
      nameBD: "model",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "",
      minLength: "1",
      maxLength: "30",
      min: "",
      max: "",
    },
  ],
  formButtons: [
    {
      label: "Crear",
      type: "primary",
      action: "",
    },
  ],
};

const createOrderForm = {
  formName: "createOrderForm",
  formColumns: 2,
  formEditable: 0,
  dataTo: "prueba",
  id_name: "car_id",
  nextAction: "",
  formGroups: [
    {
      label: "Datos del cliente",
      id: 1,
    },
    {
      label: "Datos del vehículo",
      id: 2,
    },
  ],
  formFields: [
    {
      label: "Nombre/s*",
      nameBD: "name",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 1,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Apellido/s*",
      nameBD: "surname",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "Nombre",
      isEditable: 1,
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Email",
      nameBD: "email",
      type: "text",
      required: 0,
      initialValue: "",
      validation: "email",
      isEditable: 1,
      placeholder: "Email",
      minLength: 3,
      maxLength: 40,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
    {
      label: "Teléfono",
      nameBD: "phone",
      type: "text",
      required: 0,
      initialValue: "",
      validation: "",
      isEditable: 1,
      placeholder: "Teléfono",
      minLength: 4,
      maxLength: 12,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
    {
      label: "Kilómetros",
      nameBD: "kilometres",
      type: "kilometres",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 1,
      placeholder: "Ej: 125.983",
      minLength: 2,
      maxLength: 10,
      min: "",
      max: "",
      column: 1,
      group: 2,
    },
    {
      label: "Anomalías",
      nameBD: "anomalies",
      type: "add",
      required: 1,
      initialValue: "",
      validation: "atLeastOne",
      isEditable: 1,
      placeholder: "Introduce aquí las anomalías",
      minLength: 2,
      maxLength: 10,
      min: "",
      max: "",
      column: 2,
      group: 2,
    },
  ],
  formButtons: [
    {
      label: "Crear orden",
      type: "primary",
      action: "",
    },
  ],
};

const orderDetails = {
  formName: "createOrderForm",
  formColumns: 2,
  formEditable: 1,
  dataFrom: "getOrder",
  dataTo: "",
  formFields: [
    {
      label: "ID de la orden",
      nameBD: "id",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 0,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Kilómetros",
      nameBD: "kilometres",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 0,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Estado",
      nameBD: "state",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 0,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Fecha de entrada",
      nameBD: "date_in",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 0,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 1,
      group: 1,
    },
    {
      label: "Nombre/s*",
      nameBD: "name",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      isEditable: 1,
      placeholder: "Nombre",
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
    {
      label: "Apellido/s*",
      nameBD: "surname",
      type: "text",
      required: 1,
      initialValue: "",
      validation: "",
      placeholder: "Nombre",
      isEditable: 1,
      minLength: 2,
      maxLength: 30,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
    {
      label: "Email*",
      nameBD: "email",
      type: "text",
      required: 0,
      initialValue: "",
      validation: "email",
      isEditable: 1,
      placeholder: "Email",
      minLength: 4,
      maxLength: 40,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
    {
      label: "Teléfono",
      nameBD: "phone",
      type: "text",
      required: 0,
      initialValue: "",
      validation: "",
      isEditable: 1,
      placeholder: "Teléfono",
      minLength: 12,
      maxLength: 6,
      min: "",
      max: "",
      column: 2,
      group: 1,
    },
  ],
  formButtons: [
    [
      {
        label: "Editar",
        type: "warning",
        action: "onEdit",
      },
    ],
    [
      {
        label: "Guardar",
        type: "primary",
        action: "onSaveEdit",
      },
      {
        label: "Cancelar",
        type: "danger",
        action: "onCancelEdit",
      },
    ],
  ],
};

export const configForms = {
  loginForm: loginForm,
  createCarForm: createCarForm,
  createOrderForm: createOrderForm,
  orderDetailsForm: orderDetails,
  searchCarForm: searchCarForm,
};
