import { Box, Container, Tab, Tabs } from '@mui/material'
import { AssignmentTab, LectureTab } from './components'
import { useState } from 'react'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
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

export function LessonManagementPage() {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabs = [
    {
      label: 'Lecture',
      component: <LectureTab />,
    },
    {
      label: 'Assignment',
      component: <AssignmentTab />,
    },
  ]

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label='basic tabs example'>
          {tabs.map((tab, index) => (
            <Tab label={tab.label} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((_, index) => (
        <CustomTabPanel value={selectedTab} index={index} key={index}>
          {tabs[index].component}
        </CustomTabPanel>
      ))}
    </Container>
  )
}
