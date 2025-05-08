const config = {
  baseUrl: 'http://localhost:3502/',
  apps: {
    paye: {
      iabd: {
        username: '618348224081',
        password: 'Ve4VStVdMok2',
        email: 'zoe.clarke@example.com',
        vatdate: '2009-03-27',
        selfAssesment: '6151763638',
        individual: {
          firstName: 'Zoe',
          lastName: 'Clarke',
          dateOfBirth: '1982-04-22',
          address: {
            line1: '5 Edgware Road',
            line2: 'Uxbridge',
            postcode: 'TS16 1PA'
          }
        },
        groubID: '152758763227',
        vatNumber: '968259170',
        fullname: 'Zoe Clarke',
        EORI: 'GB799359605368',
        nino: 'XB531155D',
        taxId: 'XDIT00518583644'
      }
    }
  }
};

exports.config = config;
