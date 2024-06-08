import { primary } from '@/styles/theme'
import { MenuItem, Select } from '@mui/material'
import { BaseSelectProps } from '@mui/material/Select'

interface ICustomSelectProps extends BaseSelectProps {
  data: { label: string; value: any }[] | []
}
export function CustomSelect({ data, sx, ...props }: ICustomSelectProps) {
  return (
    <Select
      sx={{
        borderRadius: 3,
        fontSize: 14,
        bgcolor: primary[500],
        color: 'white',
        fontWeight: 500,
        ':focus': {
          borderColor: 'transparent',
        },
        borderColor: 'transparent !important',
        outline: 'none !important',
        ...sx,
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            fontSize: 14,
            borderRadius: 4,
            bgcolor: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9e9e9',
            '& .MuiMenuItem-root': {
              fontWeight: 500,
              fontSize: 14,
              mx: 1,
              px: 2,
              borderRadius: 3,
              '&:hover': {
                bgcolor: primary[50],
                borderColor: primary[50],
              },
              '&.Mui-selected': {
                bgcolor: primary[100],
              },
            },
          },
        },
      }}
      {...props}
    >
      {data.map((item) => (
        <MenuItem value={item.value} key={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}
