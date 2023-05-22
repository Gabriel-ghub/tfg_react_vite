import React, { useState, useEffect } from 'react'
import { useToken } from '../../hooks/useToken';
import useHttp from '../../hooks/useHttp';
import { set, useForm } from 'react-hook-form';
import { BASE_URL } from '../../api/api';
import { NumericFormat } from 'react-number-format';
export const WorksAndMaterials = ({ order }) => {
  const order_id = order;
  const { getToken } = useToken();
  const { sendRequest } = useHttp()
  const [materials, setMaterials] = useState([])
  const [newMaterials, setNewMaterials] = useState([])
  // const [newWorks, setNewWorks] = useState([])
  const [isEditMaterial, setIsEditMaterial] = useState()
  const [works, setWorks] = useState([])
  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm()
  const [price, setPrice] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/orders/worksandmaterials/${order_id}`;
      const token = getToken()
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url, "GET", null, headers)
      console.log(response)
      if (response) {
        setMaterials(response.materials)
        setWorks(response.works)
      }
    }
    fetchData();
  }, [])


  const handleEdit = (e, id_material) => {
    e.preventDefault();
    setValue("price", "")
    setIsEditMaterial({ value: true, id: id_material })
  }

  const handleSavePrice = async (e) => {
    const urlUpdatePrice = `${BASE_URL}/material`;
    const token = getToken()
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      material_id: isEditMaterial.id,
      price: price
    }
    const response = await sendRequest(urlUpdatePrice, "PUT", JSON.stringify(body), headers)
    console.log(response)
    if (response) {
      const materialUpdated = {
        price: response.price,
        description: response.description,
        id: response.id,
        quantity: response.quantity
      }
      const temp_materials = materials.map(each => {
        if (each.id == response.id) {
          each.price = response.price
        }
        return each
      })
      setIsEditMaterial(false)
      setMaterials(temp_materials)
    }
  }

  const handleSetPrice = (values) => {
    const { value } = values;
    console.log(value)
    setPrice(value)
  }

  return (
    <div className="row shadow-lg border py-3 border-1 rounded mt-5">
      <h3 className='text-center mb-5'>Trabajos</h3>
      <h5 className=''>Trabajos realizados</h5>
      {
        works.length > 0
          ? works.map((each, index) => {
            return (
              <div className='col-12 d-flex gap-1 mb-2' key={index} >
                <p className='m-1 py-1 form-control' style={{ backgroundColor: "#e9ecef" }}>{each.description}</p>
              </div>
            )
          })
          : <p className='mt-2'>Sin trabajos</p>
      }
      <h5 className='my-3'>Materiales utilizados</h5>
      <table class="table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col" className='w-50'>Respuesto</th>
            <th scope="col" className=''>Cantidad</th>
            <th scope="col" className=''>Precio</th>
            <th scope="col" className=''>Total</th>
          </tr>
        </thead>
        <tbody>
          {
            materials.length > 0
              ? materials.map((each, index) => {
                return (
                  <>
                    {/* <div className='col-12 d-flex gap-1 mb-2' key={index} >
                  <p className='m-1 py-1 w-100' style={{ backgroundColor: "#e9ecef" }}>{each.description}</p>
                  <p className='m-1 py-1 px-3' style={{ backgroundColor: "#e9ecef" }}>{each.quantity}</p>
                  <p className='m-1 py-1 px-3' style={{ backgroundColor: "#e9ecef" }}>prsss</p>
                  <p className='m-1 py-1 px-3' style={{ backgroundColor: "#e9ecef" }}>total</p>
                  <button className="btn btn-danger">Borrar</button>
                </div> */}


                    <tr>
                      <td>{each.description}</td>
                      <td>{each.quantity}</td>
                      <td className='d-flex justify-content-between'>
                        {
                          (isEditMaterial && isEditMaterial.id == each.id)
                            ? <>
                              <NumericFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                decimalScale={2}
                                fixedDecimalScale
                                onValueChange={handleSetPrice}
                                allowNegative={false}
                                suffix={'€'}
                                className="input"
                              />
                              <svg className='' role="button" onClick={(e) => handleSavePrice(e, each.id)}  width="25" height="25" class="bi bi-check-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
                              </svg>
                              <svg  role="button" onClick={()=>setIsEditMaterial(false)}  width="25" height="25"  class="bi bi-x-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                              </svg>
                            </>
                            : <>
                              <p>{parseFloat(each.price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</p>
                              <svg role="button" onClick={(e) => handleEdit(e, each.id)}  width="25" height="25" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                              </svg>
                            </>
                        }
                      </td>
                      <td>{parseFloat(each.price * each.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</td>
                    </tr>
                    {
                      (index == materials.length - 1)
                        ? (
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              {parseFloat(materials.reduce((total, material) => {
                                return total + material.price * material.quantity;
                              }, 0)).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </td>
                          </tr>
                        )
                        : null}
                  </>
                )
              })
              : <p className='mt-2'>Sin materiales</p>
          }
        </tbody>
      </table>
    </div>
  )
}
