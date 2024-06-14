import Slider, { Settings } from 'react-slick'
import companyGoogleImg from '@/assets/images/landingPage/company-google.png'
import { Box, Container, Typography } from '@mui/material'
import { gray } from '@/styles/theme'

export function ColabSlide() {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }
  return (
    <Container maxWidth='lg' sx={{ py: 8 }}>
      <Typography variant='body1' color={gray[500]} fontWeight={500} textAlign='center' mb={8}>
        Trusted by 5,000+ Companies Worldwide
      </Typography>
      <Slider {...settings}>
        {Array(10)
          .fill(true)
          .map((_, index) => (
            <Box component='img' src={companyGoogleImg} alt='company-google' height={40} key={index} mx={-4} px={4} />
          ))}
      </Slider>
    </Container>
  )
}
