import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useNavigate } from 'react-router'

export default function DueBadge({ count }) {
  const hasDue = count > 0
  const navigate = useNavigate()

  const handleClick = () => {
    if (hasDue) {
      navigate('/review/today')
    }
  }

  return (
    <Tooltip title={hasDue ? `${count} carte${count > 1 ? 's' : ''} à réviser` : "Aucune carte à réviser"}>
      <span style={{ cursor: hasDue ? 'pointer' : 'default' }} onClick={handleClick}>
        <Badge badgeContent={count} color={hasDue ? "error" : "default"} showZero>
          {hasDue ? <NotificationsActiveIcon color="error" /> : <NotificationsNoneIcon color="disabled" />}
        </Badge>
      </span>
    </Tooltip>
  )
}
