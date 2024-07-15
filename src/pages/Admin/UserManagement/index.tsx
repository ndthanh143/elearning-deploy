import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { StudentTab, TeacherTab } from './components'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  )
}

export const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabs = [
    {
      label: 'Student',
      component: <StudentTab />,
    },
    {
      label: 'Teacher',
      component: <TeacherTab />,
    },
  ]

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleChange} aria-label='basic tabs example'>
        {tabs.map((tab, index) => (
          <Tab label={tab.label} {...a11yProps(index)} key={index} />
        ))}
      </Tabs>

      {tabs.map((_, index) => (
        <CustomTabPanel value={selectedTab} index={index} key={index}>
          {tabs[index].component}
        </CustomTabPanel>
      ))}
    </Box>
  )
}
