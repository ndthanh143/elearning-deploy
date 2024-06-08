import { AssignmentIcon } from './AssignmentIcon'
import { CalendarIcon } from './CalendarIcon'
import { CloseIcon } from './CloseIcon'
import { DeadlineIcon } from './DeadlineIcon'
import { DescriptionIcon } from './DescriptionIcon'
import { EducationIcon } from './EducationIcon'
import { ExcelIcon } from './Excel'
import { GroupIcon } from './GroupIcon'
import { LectureIcon } from './LectureIcon'
import { LockIcon } from './LockIcon'
import { NoDataIcon } from './Nodata'
import { NotificationIcon } from './Notification'
import { OTPIcon } from './OTPIcon'
import { Owl } from './Owl'
import { PlanBasicIcon } from './PlanBasicIcon'
import { PlanMindMapIcon } from './PlanMindMapIcon'
import { QuizIcon } from './QuizIcon'
import { ResourceIcon } from './ResourceIcon'
import { TaskIcon } from './TaskIcon'
import { TitleIcon } from './TitleIcon'
import { UploadIcon } from './UploadIcon'
import { YoutubeIcon } from './Youtube'

export const icons = {
  notification: <NotificationIcon />,
  owl: <Owl />,
  youtube: <YoutubeIcon />,
  excel: <ExcelIcon />,
  noData: <NoDataIcon />,
  group: <GroupIcon />,
  close: <CloseIcon />,
  task: <TaskIcon />,
  resource: <ResourceIcon />,
  lecture: <LectureIcon />,
  assignment: <AssignmentIcon />,
  quiz: <QuizIcon />,
  planBasic: <PlanBasicIcon />,
  planMindmap: <PlanMindMapIcon />,
  title: <TitleIcon />,
  description: <DescriptionIcon />,
  calendar: <CalendarIcon />,
  deadline: <DeadlineIcon />,
  upload: <UploadIcon />,
  lock: <LockIcon />,
  education: <EducationIcon />,
  otp: <OTPIcon />,
} as const
