import { createContext, forwardRef, useContext } from 'react'

import { Box } from './Box'
import type { BoxStyles } from './Box.css'
import type { TextStyles } from './Text.css'
import * as styles from './Text.css'

export type TextWrapperProps = {
  align?: TextStyles['textAlign']
  as?:
    | 'div'
    | 'p'
    | 'span'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'code'
    | 'pre'
  children: React.ReactNode
  color?: TextStyles['color']
  family?: TextStyles['fontFamily']
  size?: TextStyles['fontSize']
  style?: React.CSSProperties
  weight?: TextStyles['fontWeight']
  width?: BoxStyles['width']
  wrap?: TextStyles['overflowWrap'] | false
  testId?: string
}

export const TextContext = createContext({ root: true })

export const TextWrapper = forwardRef<HTMLDivElement, TextWrapperProps>(
  (
    {
      align,
      as: as_,
      children,
      color,
      family,
      size: size_,
      style,
      weight = 'regular',
      wrap = 'break-word',
      testId,
    }: TextWrapperProps,
    ref,
  ) => {
    const { root } = useContext(TextContext)
    const inline = !root
    const as = as_ || (inline ? 'span' : 'div')
    const size = size_ || (inline ? undefined : '15px')
    const textStyle = inline ? styles.inlineText : styles.capsizedText
    return (
      <TextContext.Provider value={{ root: false }}>
        <Box
          ref={ref as any}
          as={as}
          className={textStyle({
            color,
            fontSize: size,
            fontFamily: family,
            fontWeight: weight,
            overflowWrap: typeof wrap === 'string' ? wrap : undefined,
            textAlign: align,
          })}
          testId={testId}
          style={style}
          width={wrap ? undefined : 'full'}
        >
          {children}
        </Box>
      </TextContext.Provider>
    )
  },
)

export type TextProps = TextWrapperProps & {
  tabular?: boolean
}

export const TextBase = forwardRef<HTMLDivElement, TextProps>(
  (
    {
      align,
      as,
      children,
      color,
      family,
      size,
      style,
      tabular = false,
      weight = 'regular',
      wrap = 'break-word',
      testId,
    }: TextProps,
    ref,
  ) => {
    return (
      <TextWrapper
        ref={ref}
        align={align}
        as={as}
        color={color}
        family={family}
        size={size}
        style={style}
        weight={weight}
        testId={testId}
      >
        <Box
          as="span"
          className={[tabular && styles.tabular, !wrap && styles.overflow]}
          display={!wrap ? 'block' : undefined}
        >
          {children || '‎'}
        </Box>
      </TextWrapper>
    )
  },
)

export type TextTruncatedProps = Omit<TextWrapperProps, 'children' | 'wrap'> & {
  children?: string | null
  end?: number
  tabular?: boolean
}

export const TextTruncated = forwardRef<HTMLDivElement, TextTruncatedProps>(
  (
    {
      align,
      children,
      color,
      end = 10,
      family,
      size = '15px',
      style,
      tabular = false,
      weight = 'regular',
      testId,
    }: TextTruncatedProps,
    ref,
  ) => {
    const first = children?.slice(0, -end)
    const last = children?.slice(-end)
    return (
      <TextWrapper
        ref={ref}
        align={align}
        color={color}
        family={family}
        size={size}
        style={style}
        weight={weight}
        testId={testId}
      >
        <Box
          as="span"
          display="inline-block"
          className={[tabular && styles.tabular, styles.overflow]}
          style={{ maxWidth: `calc(100% - ${end + 1}ch)` }}
        >
          {first || '‎'}
        </Box>
        <Box
          as="span"
          display="inline-block"
          className={[tabular && styles.tabular, styles.overflow]}
        >
          {last || '‎'}
        </Box>
      </TextWrapper>
    )
  },
)

export const Text = Object.assign(TextBase, {
  Truncated: TextTruncated,
})
