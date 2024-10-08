import React, { createRef, useEffect, useState } from 'react'

import { Button, Card, CardBody, CardHeader, Select, SelectItem, Table, Tooltip } from '@nextui-org/react'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import axiosClient from '../axios-client'

export default function Dashboard() {

  const chart1Ref = createRef()
  const [loading, setLoading] = useState(false)
  const [datas1, setDatas1] = useState([])
  const [datas2, setDatas2] = useState([])

  useEffect(() => {
    getCharts1()
    getCharts2()
  }, [])

  const getCharts1 = () => {
    setLoading(true)
    axiosClient
      .get('/stockitemdashboard')
      .then(({ data }) => {
        setLoading(false)
        setDatas1(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const getCharts2 = () => {
    setLoading(true)
    axiosClient
      .get('/ppbdashboard')
      .then(({ data }) => {
        setLoading(false)
        setDatas2(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex-col">
      <div className="flex-col justify-center p-4 animated fadeInDown w-1/2">
        <Card>
          <CardHeader> Stock Item</CardHeader>
          <CardBody className='h-72 w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={datas1}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stock_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="quantity"
                  fill="#82ca9d"
                  activeShape={(props) => (
                    <Rectangle {...props} fill="gold" stroke="purple" />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
      <div className="flex-col justify-center p-4 animated fadeInDown w-[100%]">
        <Card>
          <CardHeader> PPB</CardHeader>
          <CardBody className='h-72 w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={datas2}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="On Approval" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                <Bar dataKey="Done" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="purple" />} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

{/* <h1>404 - Page Under Construction</h1>
        <div className='justify-center items-center' hidden>
          <iframe src="https://giphy.com/embed/cfGmVRsJI6wq6noGxP" width="462" height="480" class="giphy-embed" allowFullScreen></iframe>
        </div>
        <div className='flex justify-center items-center h-[700px]'>
          <iframe src="https://giphy.com/embed/vR1dPIYzQmkRzLZk2w" width="462" height="480" class="giphy-embed" allowFullScreen></iframe>
        </div> */}
