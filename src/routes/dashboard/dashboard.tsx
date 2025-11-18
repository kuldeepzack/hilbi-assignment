/* eslint-disable prettier/prettier */
import { BulbOutlined, CloudOutlined, PoweroffOutlined, RightOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Skeleton, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { User } from '@/utils/types'

const Dashboard: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [inactiveUsers, setInactiveUsers] = useState<number>(0);
  const [lastFiveActiveUsers, setLastFiveActiveUsers] = useState<Array<User>>([]);

  async function getTotalUsers() {
    const response = await fetch(`${t('serverURL')}/users?page=1&pageSize=1`);
    const result = await response.json();
    setTotalUsers(result?.pagination?.total);
  }

  async function getActiveUsers() {
    const response = await fetch(`${t('serverURL')}/users?page=1&pageSize=1&status=active`);
    const result = await response.json();
    setActiveUsers(result?.pagination?.total);
  }

  async function getInactiveUsers() {
    const response = await fetch(`${t('serverURL')}/users?page=1&pageSize=1&status=inactive`);
    const result = await response.json();
    setInactiveUsers(result?.pagination?.total);
  }

  async function getLastFiveActiveUsers() {
    const response = await fetch(`${t('serverURL')}/users?page=1&pageSize=5&sortBy=createdAt&direction=DESC&status=active`);
    const result = await response.json();
    setLastFiveActiveUsers(result?.items);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getTotalUsers();
      await getActiveUsers();
      await getInactiveUsers();
      await getLastFiveActiveUsers();
      setLoading(false);
    })()
  }, [t]);

  return (
    <div className="tw:py-4 tw:px-16">
      <Card style={{ border: '1px solid #eee' }}>
        <Breadcrumb items={[{ title: t('dashboard.title') }]} />
        <Typography.Title level={2} style={{ margin: '10px 0px' }}>
          {t('dashboard.description')}
        </Typography.Title>
        {/* <h1 className="tw:text-2xl tw:font-bold mb-4"></h1>
        <p>{t('dashboard.description')}</p> */}
      </Card>
      <br />
      <Row gutter={16}>
        {
          [
            {
              title: "Total Users",
              icon: <CloudOutlined />,
              description: "Total registered accounts",
              value: totalUsers
            },
            {
              title: "Active Users",
              icon: <BulbOutlined />,
              description: "Total active account",
              value: activeUsers
            },
            {
              title: "Inactive Users",
              icon: <PoweroffOutlined />,
              description: "Total Inactive account",
              value: inactiveUsers
            }
          ].map(stats =>
            <Col span={8}>
              <Card size="small" title={
                <Flex justify='space-between'>
                  <span>{stats.title}</span>
                  {stats.icon}
                </Flex>
              }>
                {loading ?
                  <Skeleton.Button active={true} size="small" shape={"default"} className='tw:my-2' /> :
                  <Typography.Title level={2} className="tw:my-1">{stats.value}</Typography.Title>
                }
                <Typography>{stats.description}</Typography>
              </Card>
            </Col>
          )
        }
      </Row>
      <br />
      <Card title={
        <Flex justify='space-between'>
          <span>Last Active Users</span>
          <a href="/users/list">All users <RightOutlined /></a>
        </Flex>
      }>
        {
          loading ?
            <>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} avatar paragraph={{ rows: 2 }} active />
              ))}
            </>
            :
            <List
              itemLayout="horizontal"
              dataSource={lastFiveActiveUsers}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: '#FF9C6E',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.firstName.charAt(0).toUpperCase()}
                        {item.lastName.charAt(0).toUpperCase()}
                      </Avatar>}
                    title={<a href="https://ant.design">{item.firstName + " " + item.lastName}</a>}
                    description={item.email}
                  />
                  <Typography.Text type='secondary'>{item.createdAt.split("-").reverse().join(".")}</Typography.Text>
                </List.Item>
              )}
            />}
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Dashboard,
})