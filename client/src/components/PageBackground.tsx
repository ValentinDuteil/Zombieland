import { Box } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface PageBackgroundProps extends BoxProps {
  bgImage: string
  children: ReactNode
}

export const PageBackground = ({ bgImage, children, ...rest }: PageBackgroundProps) => {
  return (
    <Box
      position="relative"
      minH="100vh"
      w="100%"
      overflow="hidden"
      {...rest}
      css={{
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        },
      }}
    >
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDirection="column"
        minH="100vh"
        w="100%"
      >
        {children}
      </Box>
    </Box>
  )
}
