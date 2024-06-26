import { CustomSelect, Flex } from '@/components'
import { Stack, Typography } from '@mui/material'
import { CreateCourseForm } from '.'

const listCurrentCyAndMounts: Record<string, { label: string; value: number }[]> = {
  USD: [
    {
      label: 'Free',
      value: 0,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '20',
      value: 20,
    },
    {
      label: '30',
      value: 30,
    },
    {
      label: '40',
      value: 40,
    },
    {
      label: '50',
      value: 50,
    },
    {
      label: '60',
      value: 60,
    },
    {
      label: '70',
      value: 70,
    },
    {
      label: '80',
      value: 80,
    },
    {
      label: '90',
      value: 90,
    },
    {
      label: '100',
      value: 100,
    },
  ],
  VND: [
    {
      label: 'Free',
      value: 0,
    },
    {
      label: '100,000',
      value: 100000,
    },
    {
      label: '200,000',
      value: 200000,
    },
    {
      label: '300,000',
      value: 300000,
    },
    {
      label: '400,000',
      value: 400000,
    },
    {
      label: '500,000',
      value: 500000,
    },
    {
      label: '600,000',
      value: 600000,
    },
    {
      label: '700,000',
      value: 700000,
    },
    {
      label: '800,000',
      value: 800000,
    },
    {
      label: '900,000',
      value: 900000,
    },
    {
      label: '1,000,000',
      value: 1000000,
    },
  ],
}

interface IPriceConfigProps {
  onNext?: () => void
  form: CreateCourseForm
}

export function PriceConfig({ form }: IPriceConfigProps) {
  const { setValue, watch } = form

  return (
    <Stack gap={4}>
      <Stack>
        <Typography variant='h3' fontWeight={700}>
          Price configuration
        </Typography>
        <Typography variant='body2'>
          Please select the currency and price for your course. If you want to offer your course for free, it must have
          a total video length of less than 2 hours. Additionally, courses with practice tests cannot be free.
        </Typography>
      </Stack>
      <Flex gap={4}>
        <Stack gap={1}>
          <Typography fontWeight={700}>Currency</Typography>
          <CustomSelect
            defaultValue={watch('currency')}
            data={Object.keys(listCurrentCyAndMounts).map((item) => ({ label: item, value: item }))}
            onChange={(e) => setValue('currency', e.target.value as string)}
          />
        </Stack>
        <Stack gap={1}>
          <Typography fontWeight={700}>Amount</Typography>
          <CustomSelect
            defaultValue={watch('price')}
            sx={{ minWidth: 100 }}
            placeholder='Select'
            data={listCurrentCyAndMounts[watch('currency') as string]}
            onChange={(e) => setValue('price', Number(e.target.value))}
          />
        </Stack>
      </Flex>
    </Stack>
  )
}
