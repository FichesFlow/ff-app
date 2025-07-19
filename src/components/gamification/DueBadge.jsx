import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

export default function DueBadge({ count }) {
  const hasDue = count > 0
  return (
    <Tooltip title={hasDue ? `${count} carte${count > 1 ? 's' : ''} à réviser` : "Aucune carte à réviser"}>
      <Badge badgeContent={count} color={hasDue ? "error" : "default"} showZero>
        {hasDue ? <NotificationsActiveIcon color="error" /> : <NotificationsNoneIcon color="disabled" />}
      </Badge>
    </Tooltip>
  )
}

