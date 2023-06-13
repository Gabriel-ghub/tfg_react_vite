import React, { useContext, useEffect, useState } from "react";
import { configForms } from "../config/formConfigs";
import { set, useForm } from "react-hook-form";
import { InputText } from "./inputs/InputText";
import { InputPassword } from "./inputs/InputPassword";
import { Main } from "../private/components/global/Main";
import useHttpNew from "../hooks/useHttpNew";
import { API_URLS } from "../config/apiCalls";
import { FormButtons } from "./FormButtons";
import { InputAdd } from "./inputs/InputAdd";
import { InputKilometres } from "./inputs/InputKilometres";
import { Loader } from "./Loader";


const availableInputs = {
  text: InputText,
  password: InputPassword,
  add: InputAdd,
  kilometres: InputKilometres,
};

const render = (
  type,
  field,
  register,
  errors,
  isEditing,
  dataForm,
  formEditable,
  setValue,
  getValues,
  setError,
  clearErrors
) => {
  const Input = availableInputs[type];
  return (
    <Input
      data={field}
      register={register}
      errors={errors}
      isEditing={isEditing}
      dataForm={dataForm}
      formEditable={formEditable}
      setValue={setValue}
      getValues={getValues}
      setError={setError}
      clearErrors={clearErrors}
    />
  );
};

export const FormularioReactivo = ({
  formName,
  className,
  action,
  urlData = false,
}) => {
  const [fields, setFields] = useState(false);
  const [buttons, setButtons] = useState();
  const [columns, setColumns] = useState(false);
  const [groups, setGroups] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { sendRequest, isLoading } = useHttpNew();
  const [dataForm, setDataForm] = useState(false);
  const [formEditable, setFormEditable] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      if (urlData) {
        const data = await sendRequest(urlData, "GET", null);
        setDataForm(data.order);
        console.log(data);
        return data.order;
      }
      setLoadingForm(false);
    },
  });

  const onSubmit = async (data) => {
    const dataToSend = {
      ...data,
    };
    action(dataToSend);
  };

  useEffect(() => {
    setButtons(configForms[formName].formButtons);
    setColumns(configForms[formName].formColumns);
    setGroups(configForms[formName].formGroups);
    setFormEditable(configForms[formName].formEditable);

    if (
      configForms[formName].formGroups &&
      configForms[formName].formGroups.length > 1
    ) {
      const group1 = configForms[formName].formFields.filter(
        (field) => field.group === 1
      );
      const group2 = configForms[formName].formFields.filter(
        (field) => field.group === 2
      );

      console.log(group1);
      console.log(group2);
      if (
        configForms[formName].formColumns &&
        configForms[formName].formColumns > 1
      ) {
        const g1_column1 = group1.filter((field) => field.column === 1);
        const g1_column2 = group1.filter((field) => field.column === 2);
        const g2_column1 = group2.filter((field) => field.column === 1);
        const g2_column2 = group2.filter((field) => field.column === 2);
        setFields({
          1: [g1_column1, g1_column2],
          2: [g2_column1, g2_column2],
        });
      } else {
        setFields([group1, group2]);
      }
    } else if (
      configForms[formName].formColumns &&
      configForms[formName].formColumns > 1
    ) {
      const column1 = configForms[formName].formFields.filter(
        (field) => field.column === 1
      );
      const column2 = configForms[formName].formFields.filter(
        (field) => field.column === 2
      );
      setFields([column1, column2]);
    } else {
      setFields(configForms[formName].formFields);
    }
  }, []);

  const onEdit = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  const onDelete = (e) => {};

  const onCancelEdit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <>
      {loadingForm && <Loader />}
      {!loadingForm && (
        <form className={className} onSubmit={handleSubmit(onSubmit)}>
          {/* Renderizado, grupos y columnas */}
          {fields && columns && columns > 1 && groups && groups.length > 1 && (
            <>
              <div className="row p-4">
                <div className="col-12">
                  <h3>{groups[0].label}</h3>
                </div>
                <div className="col-12 col-md-6">
                  {fields[groups[0].id][0].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-12 col-md-6">
                  {fields[groups[0].id][1].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="row p-4">
                <div className="col-12">
                  <h3>{groups[1].label}</h3>
                </div>
                <div className="col-12 col-md-6">
                  {fields[groups[1].id][0].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-12 col-md-6">
                  {fields[groups[1].id][1].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Renderizado, solo columnas */}
          {fields &&
            columns &&
            columns > 1 &&
            (!groups || groups.length < 1) && (
              <div className="row p-4">
                <div className="col-12 col-md-6">
                  {fields[0].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-12 col-md-6">
                  {fields[1].map((field) => (
                    <div key={field.name}>
                      {render(
                        field.type,
                        field,
                        register,
                        errors,
                        isEditing,
                        dataForm,
                        formEditable,
                        setValue,
                        getValues,
                        setError,
                        clearErrors
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Renderizado, sin grupos ni columnas */}
          {fields && (columns < 2 || !columns) && (
            <div className="d-flex flex-column gap-3">
              {fields.map((field) => (
                <div key={field.name}>
                  {render(
                    field.type,
                    field,
                    register,
                    errors,
                    isEditing,
                    dataForm,
                    formEditable,
                    setValue,
                    getValues,
                    setError,
                    clearErrors
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Renderizado de botones de formularios de edición*/}
          {fields && !isLoading && buttons && buttons.length > 0 && (
            <FormButtons
              buttons={buttons}
              formType={formEditable}
              isEditing={isEditing}
              onEdit={onEdit}
              onCancelEdit={onCancelEdit}
              formEditable={formEditable}
            />
          )}
          {isLoading && <Loader />}
        </form>
      )}
    </>
  );
};
