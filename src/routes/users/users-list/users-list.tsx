import { useTranslation } from 'react-i18next';
import { createFileRoute } from '@tanstack/react-router'
import { Card, Table, Tag } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import type { TableColumnsType, TableProps } from 'antd';
import type { User } from '@/utils/types';

const UsersList: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [data, setData] = useState<Array<User>>([]);
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const statusQuery = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const response = await fetch(
        `${t('serverURL')}/users?page=${page}&pageSize=${pageSize}${statusQuery}&sortBy=createdAt&direction=DESC`
      );
      const result = await response.json();

      if (result?.items) {
        setData(result.items);
        setTotal(result.pagination?.total || 0);
      } else {
        setData([])
        setTotal(0)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [t, page, statusFilter])

  const dataColumns: TableColumnsType<User> = [
    {
      title: 'Full Name',
      key: 'fullName',
      render: (item: User) => (
        <span style={{ fontWeight: 500 }}>{item.firstName} {item.lastName}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      filteredValue: statusFilter === 'all' ? null : [statusFilter],
      onFilter: (value: string, record: User) => record.status === value,
      render: (status: string) => {
        const color =
          status === 'active' ? 'green' :
            status === 'inactive' ? 'red' : 'orange';

        return <Tag color={color} style={{ fontSize: 13 }}>{status.toUpperCase()}</Tag>;
      },
    },

    {
      title: 'Address',
      key: 'address',
      render: (item: User) => (
        <span style={{ color: '#555' }}>
          {item.address.street}, {item.address.city}, {item.address.country}
        </span>
      ),
    },
    {
      title: 'Account Balance',
      key: 'account',
      render: (item: User) => (
        <span style={{ fontWeight: 500 }}>
          {item.account.currency} {item.account.balance.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Date of Creation',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        <span style={{ color: '#666' }}>
          {date.split('-').reverse().join('.')}
        </span>,
    },
  ];

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers]);

  const handleChange: TableProps<User>['onChange'] = (pagination, filters) => {
    setPage(pagination.current || 1)
    const newStatus =
      filters.status && filters.status.length > 0
        ? (filters.status[0] as string)
        : 'all'
    setStatusFilter(newStatus)
  }

  return (
    <div className="tw:py-6 tw:px-16">
      <Card
        title={t('usersList.title')}
        style={{ borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      >
        <Table<User>
          rowKey="id"
          columns={dataColumns}
          loading={loading}
          dataSource={data}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
          }}
          onChange={handleChange}
          bordered
          style={{ borderRadius: 10 }}
        />
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/users/list')({
  component: UsersList,
})
