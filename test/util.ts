import type { RequiredConfig } from '@autobg/shared'

// fake file list
export const filelist = [
  '/public/foo.png',
  '/bar.png',
  '/src/assets/foo.png',
]

export const configs = {
  posix: {
    root: '/project',
    id: '/project/src/main.ts',
    config: {
      alias: { '@/': 'src' },
      publicPath: 'public',
    },
  },
  win32: {
    root: 'C:\\project',
    id: 'C:\\project\\src\\main.ts',
    config: {
      alias: { '@/': 'src' },
      publicPath: 'public',
    },
  },
} satisfies Record<'posix' | 'win32', {
  root: string
  id: string
  config: RequiredConfig
}>

export const paths = [
  { exist: true, type: 'absolute', path: '/foo.png', realpath: '/foo.png' },
  { exist: true, type: 'absolute', path: '/bar.png', realpath: '/bar.png' },

  { exist: false, type: 'alias', path: '@/assets/bar.png', realpath: '/src/assets/bar.png' },
  { exist: false, type: 'relative', path: './assets/bar.png', realpath: '/src/assets/bar.png' },
  { exist: false, type: 'relative', path: 'assets/bar.png', realpath: '/src/assets/bar.png' },

  { exist: true, type: 'alias', path: '@/assets/foo.png', realpath: '/src/assets/foo.png' },
  { exist: true, type: 'relative', path: './assets/foo.png', realpath: '/src/assets/foo.png' },
  { exist: true, type: 'relative', path: 'assets/foo.png', realpath: '/src/assets/foo.png' },

  { exist: false, type: 'relative', path: '../assets/bar.png', realpath: '/assets/bar.png' },

  { exist: true, type: 'http', path: 'https://autobg.test/foo.png', realpath: 'https://autobg.test/foo.png' },
] satisfies {
  exist: boolean
  type: 'absolute' | 'alias' | 'relative' | 'http'
  path: string
  realpath: string
}[]
