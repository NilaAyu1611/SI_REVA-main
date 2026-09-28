export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,vue}',
    './components/**/*.{js,ts,jsx,tsx,vue}',
    './pages/**/*.{js,ts,jsx,tsx,vue}',
    './plugins/**/*.{js,ts,jsx,tsx,vue}',
    './layouts/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          primary: '#1F1F1F',
          secondary: '#525252',
          tertiary: '#A3A3A3',
          guideInfo: '#0968F6',
          negative: '#F60909',
          positive: '#00B925',
          warning: '#FBB23B',
        },
        yellow: [
          '#FFF7EB', '#FEE8C4', '#FDD189', '#FCC162',
          '#FBB23B', '#D4952F', '#AC7824', '#855C18',
        ],
        orange: [
          '#FFF3EB', '#FEE4D2', '#FC974F', '#F66A09',
          '#B84D00', '#6B2D00', '#42210A', '#301603',
        ],
        green: [
          '#EBFFEF', '#D2FEDB', '#83FC9B', '#51FB73',
          '#00B925', '#006B15', '#0A4215', '#03300C',
        ],
        blue: [
          '#EBF3FF', '#D2E4FE', '#84B4FB', '#4D93FC',
          '#0968F6', '#004A8B', '#002A69', '#031530',
        ],
        red: [
          '#FFEBEB', '#FED2D2', '#FB8383', '#FC4F4F',
          '#B80000', '#6B0000', '#420A0A', '#300303',
        ],
        brand: {
          primaryBlue: [
            '#F3F6FC', '#E5EFF9', '#C6DAF1', '#94BDE5',
            '#5B9BD5', '#3781C7', '#2663A3', '#1F4F85',
            '#1E446E', '#193454', '#14263D',
          ],
          secondaryGold: [
            '#FBF38C', '#F9E650', '#F7D628', '#F2BD1D',
            '#D69009', '#B1670C', '#905110', '#764111',
            '#442204',
          ],
        },
      },
    },
  },
  plugins: [],
}
