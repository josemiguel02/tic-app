/* eslint-disable jsx-a11y/alt-text */
import { NOTE_QUALIFICATION } from '@/utils/constants'
import {
  Page,
  Document,
  View,
  Text,
  Image,
  StyleSheet
} from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types/style'

interface FlexProps {
  column: boolean
  justifyCenter: boolean
  alignCenter: boolean
  style: Style
}

const Flex: FCC<Partial<FlexProps>> = ({
  column,
  justifyCenter,
  alignCenter,
  children,
  style
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        justifyContent: justifyCenter ? 'center' : 'flex-start',
        alignItems: alignCenter ? 'center' : 'flex-start',
        ...style
      }}
    >
      {children}
    </View>
  )
}

interface UsersReportPDFProps {
  users: IUsuario[]
  usersByPostition: IUsuario[]
  admin?: IAdmin
  reportDetails: ReportType
}

export const UsersReportPDF: FCC<UsersReportPDFProps> = ({
  users,
  usersByPostition,
  admin,
  reportDetails
}) => {
  const { position, dateFrom, dateTo } = reportDetails
  const date = new Date().toLocaleDateString()
  const dateStart = new Date(`${dateFrom}T00:00`).toLocaleDateString()
  const dateEnd = new Date(`${dateTo}T00:00`).toLocaleDateString()

  const usersQuizPending = usersByPostition.filter(user => {
    if (!Boolean(user.examen_terminado) && !user.calificacion) {
      return user
    }
  })

  const usersApproved = users.filter(({ calificacion, cargo }) => {
    if (
      cargo === 'OPERADORES CDA' ||
      cargo === 'ESCANEADOR' ||
      cargo === 'ASISTENTE ESCANER'
    ) {
      return calificacion! >= 15
    }

    return calificacion! >= NOTE_QUALIFICATION
  })

  const usersFailed = users.filter(({ calificacion, examen_terminado, cargo }) => {
    if (calificacion || examen_terminado) {
      if (
        cargo === 'OPERADORES CDA' ||
        cargo === 'ESCANEADOR' ||
        cargo === 'ASISTENTE ESCANER'
      ) {
        return calificacion! < 15
      }

      return calificacion! < NOTE_QUALIFICATION
    }
  })

  if (!users) {
    return (
      <Document>
        <Page size='A4'></Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size='A4' wrap style={styles.body}>
        <View style={styles.logoContainer}>
          <Image src='/static/img/logo-tic-dark.png' style={styles.logo} />
        </View>

        <Flex column alignCenter style={{ marginTop: 30 }}>
          <Text style={styles.headerTitle}>Reporte de Usuarios</Text>
        </Flex>

        <Flex style={styles.details}>
          <View>
            <Text style={{ marginBottom: 5 }}>Cargo: {position}</Text>
            <Text style={{ marginBottom: 5 }}>Generado por: {admin?.name}</Text>
            <Text>Fecha de emisión: {date}</Text>
          </View>

          <View>
            <Text style={{ marginBottom: 5 }}>Fecha desde: {dateStart}</Text>
            <Text>Hasta: {dateEnd}</Text>
          </View>
        </Flex>

        {usersApproved.length ? (
          <Flex column style={{ marginBottom: 30 }}>
            <Text>Aprobados: {usersApproved.length}</Text>

            <View style={styles.table}>
              <Flex style={styles.th}>
                <Text style={styles.column}>Nombre</Text>
                <Text style={styles.column}>Apellidos</Text>
                <Text style={styles.column}>Cédula</Text>
                <Text style={styles.column}>Cargo</Text>
                <Text style={styles.column}>Calificación</Text>
                <Text style={styles.column}>Fecha examen</Text>
              </Flex>

              {usersApproved.map(
                ({
                  id,
                  nombre,
                  apellido,
                  cedula,
                  cargo,
                  calificacion,
                  fecha_examen
                }) => (
                  <Flex key={id} style={styles.row}>
                    <Text style={styles.column}>{nombre}</Text>
                    <Text style={styles.column}>{apellido}</Text>
                    <Text style={styles.column}>{cedula}</Text>
                    <Text style={styles.column}>{cargo}</Text>
                    <Text style={styles.column}>{calificacion}</Text>
                    <Text style={styles.column}>
                      {new Date(fecha_examen!).toLocaleDateString()}
                    </Text>
                  </Flex>
                )
              )}
            </View>
          </Flex>
        ) : null}

        {usersFailed.length ? (
          <Flex column style={{ marginBottom: 30 }}>
            <Text>Reprobados: {usersFailed.length}</Text>

            <View style={styles.table}>
              <Flex style={styles.th}>
                <Text style={styles.column}>Nombre</Text>
                <Text style={styles.column}>Apellidos</Text>
                <Text style={styles.column}>Cédula</Text>
                <Text style={styles.column}>Cargo</Text>
                <Text style={styles.column}>Calificación</Text>
                <Text style={styles.column}>Fecha examen</Text>
              </Flex>

              {usersFailed.map(
                ({
                  id,
                  nombre,
                  apellido,
                  cedula,
                  cargo,
                  calificacion,
                  fecha_examen
                }) => (
                  <Flex key={id} style={styles.row}>
                    <Text style={styles.column}>{nombre}</Text>
                    <Text style={styles.column}>{apellido}</Text>
                    <Text style={styles.column}>{cedula}</Text>
                    <Text style={styles.column}>{cargo}</Text>
                    <Text style={styles.column}>{calificacion}</Text>
                    <Text style={styles.column}>
                      {new Date(fecha_examen!).toLocaleDateString()}
                    </Text>
                  </Flex>
                )
              )}
            </View>
          </Flex>
        ) : null}

        {usersQuizPending.length ? (
          <Flex column style={{ marginBottom: 30 }}>
            <Text>Pendientes: {usersQuizPending.length}</Text>

            <View style={styles.table}>
              <Flex style={styles.th}>
                <Text style={styles.column}>Nombre</Text>
                <Text style={styles.column}>Apellidos</Text>
                <Text style={styles.column}>Cédula</Text>
                <Text style={styles.column}>Cargo</Text>
              </Flex>

              {usersQuizPending.map(
                ({ id, nombre, apellido, cedula, cargo }) => (
                  <Flex key={id} style={styles.row}>
                    <Text style={styles.column}>{nombre}</Text>
                    <Text style={styles.column}>{apellido}</Text>
                    <Text style={styles.column}>{cedula}</Text>
                    <Text style={styles.column}>{cargo}</Text>
                  </Flex>
                )
              )}
            </View>
          </Flex>
        ) : null}

        {/* Total Users */}
        <Flex style={styles.usersCount}>
          <Text>Total: {usersByPostition.length} Usuarios</Text>
        </Flex>

        {/* Pagination Text */}
        <Text
          fixed
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#424242',
    paddingTop: 35,
    paddingBottom: 70,
    paddingHorizontal: 35
  },
  logoContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '500px'
  },
  logo: {
    width: '200px',
    height: 'auto',
    maxWidth: '100%'
  },
  details: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 50,
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 20,
    color: '#151515',
    fontWeight: 'bold'
  },
  table: {
    fontSize: 10,
    width: '100%',
    marginTop: 10
  },
  th: {
    paddingTop: 8,
    color: '#293BDD',
    paddingBottom: 8,
    paddingHorizontal: 20,
    fontWeight: 'extrabold',
    backgroundColor: '#293BDD40'
  },
  row: {
    paddingTop: 8,
    color: '#404040',
    paddingBottom: 8,
    borderTop: '1px solid #bebebe',
    paddingHorizontal: 20
  },
  column: {
    width: '100%',
    textAlign: 'center'
  },
  usersCount: {
    marginTop: 30,
    justifyContent: 'flex-end'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
})
