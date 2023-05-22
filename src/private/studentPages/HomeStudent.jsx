import React, { useEffect, useState } from 'react'
import { Layout } from '../components/global/Layout'
import { Main } from '../components/global/Main'
import { CardOrder } from '../studentComponents/CardOrder'
import useHttp from '../../hooks/useHttp'
import { BASE_URL } from '../../api/api'
import { useToken } from '../../hooks/useToken'
import { Error } from '../../components/Error'

export const HomeStudent = () => {
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [pendingOrders, setPendingOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const { getToken } = useToken();

  useEffect(() => {
    const getWorks = async () => {
      const url = `${BASE_URL}/orders/student`
      const token = getToken()
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url, "GET", null, headers)
      console.log(response)

      setPendingOrders(response.pending)
      setCompletedOrders(response.finished)
    }
    getWorks();
  }, [])

  const handleComplete = async (e, work, studentComment) => {

    const url = `${BASE_URL}/works/change_state`
    const body = {
      work_id: work.id,
      description: studentComment
    }
    const token = getToken()
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url, "PATCH", JSON.stringify(body), headers)
    if (response) {
      const temp_pendingWorks = pendingOrders.filter(w => w.id != work.id)
      const temp_completedWorks = [...completedOrders, { ...work, state: 1, comment: studentComment }];
      setPendingOrders(temp_pendingWorks);
      setCompletedOrders(temp_completedWorks);
    }
  }

  return (
    <>
      <Layout />
      <Main page={"homeStudent"}>
        <div className="row mt-3 shadow-lg p-4 rounded">
          <div className="col-12 mb-4">
            <h3>Ordenes pendientes</h3>
          </div>
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {pendingOrders.length > 0 && pendingOrders.map((order) => {
              return (
                <CardOrder key={order.id} {...order} order={order} handleComplete={handleComplete} error={error} clearError={clearError} />
              )
            })}
          </div>
        </div>
        <div className="row mt-5 shadow-lg p-4 rounded">
          <div className="col-12 mb-4">
            <h3>Ordenes finalizados</h3>
          </div>
          {completedOrders.length > 0 && completedOrders.map((order) => {
            return (
              <div key={order.id} className="row">
                <CardOrder {...order} />
              </div>)
          })}
        </div>
      </Main>
    </>
  )
}
