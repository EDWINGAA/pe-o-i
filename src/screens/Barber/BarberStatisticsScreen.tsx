import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useAuth, useAppointments, useTheme } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

type PeriodType = 'week' | 'month';
type ComparisonType = 'current' | 'previous' | 'comparison';

export default function BarberStatisticsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { getBarberAppointments } = useAppointments();
  const { theme } = useTheme();
  
  const [periodType, setPeriodType] = useState<PeriodType>('week');
  const [comparisonView, setComparisonView] = useState<ComparisonType>('current');

  if (!user) return null;

  const appointments = getBarberAppointments(user.barberId || '1');

  // Función para obtener el inicio de la semana
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Función para obtener el inicio del mes
  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Calcular estadísticas por periodo
  const calculatePeriodStats = (startDate: Date, endDate: Date) => {
    const periodAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= startDate && aptDate <= endDate;
    });

    const completed = periodAppointments.filter(apt => apt.status === 'completed');
    const totalRevenue = completed.reduce((sum, apt) => sum + apt.price, 0);
    const uniqueClients = new Set(completed.map(apt => apt.clientId)).size;
    const averageTicket = completed.length > 0 ? totalRevenue / completed.length : 0;
    const totalAppointments = completed.length;
    
    // Calcular servicios más populares
    const servicesCount: { [key: string]: number } = {};
    completed.forEach(apt => {
      servicesCount[apt.serviceName] = (servicesCount[apt.serviceName] || 0) + 1;
    });

    return {
      totalRevenue,
      uniqueClients,
      averageTicket,
      totalAppointments,
      servicesCount,
      appointments: completed,
    };
  };

  const stats = useMemo(() => {
    const now = new Date();
    let currentStart: Date, currentEnd: Date;
    let previousStart: Date, previousEnd: Date;

    if (periodType === 'week') {
      currentStart = getWeekStart(now);
      currentEnd = new Date(now);
      
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 7);
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousEnd.getDate() - 1);
    } else {
      currentStart = getMonthStart(now);
      currentEnd = new Date(now);
      
      previousStart = new Date(currentStart);
      previousStart.setMonth(previousStart.getMonth() - 1);
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousEnd.getDate() - 1);
    }

    return {
      current: calculatePeriodStats(currentStart, currentEnd),
      previous: calculatePeriodStats(previousStart, previousEnd),
    };
  }, [appointments, periodType]);

  const currentStats = stats.current;
  const previousStats = stats.previous;

  // Calcular diferencias porcentuales
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = calculatePercentageChange(currentStats.totalRevenue, previousStats.totalRevenue);
  const clientsChange = calculatePercentageChange(currentStats.uniqueClients, previousStats.uniqueClients);
  const appointmentsChange = calculatePercentageChange(currentStats.totalAppointments, previousStats.totalAppointments);

  // Datos para gráfica de ingresos (pastel)
  const revenuePieData = [
    {
      name: 'Actuales',
      population: currentStats.totalRevenue,
      color: theme.success,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Anteriores',
      population: previousStats.totalRevenue,
      color: theme.disabled,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  // Datos para gráfica de clientes (pastel)
  const clientsPieData = [
    {
      name: 'Actuales',
      population: currentStats.uniqueClients,
      color: theme.primary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Anteriores',
      population: previousStats.uniqueClients,
      color: theme.disabled,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  // Datos para gráfica de citas (pastel)
  const appointmentsPieData = [
    {
      name: 'Actuales',
      population: currentStats.totalAppointments,
      color: '#9b59b6',
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: 'Anteriores',
      population: previousStats.totalAppointments,
      color: theme.disabled,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  // Datos para gráfica de servicios más populares
  const topServices = Object.entries(currentStats.servicesCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const servicesPieData = topServices.map(([name, count], index) => ({
    name,
    population: count,
    color: [theme.danger, theme.warning, '#1abc9c', '#34495e'][index],
    legendFontColor: theme.text,
    legendFontSize: 11,
  }));

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const MetricCard = ({ 
    title, 
    current, 
    previous, 
    percentageChange, 
    icon, 
    color,
    format = (val: number) => val.toString()
  }: any) => (
    <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{format(current)}</Text>
      {comparisonView !== 'current' && (
        <View style={[styles.metricComparison, { borderTopColor: theme.divider }]}>
          <Text style={[styles.metricPrevious, { color: theme.textSecondary }]}>
            Anterior: {format(previous)}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons 
              name={percentageChange >= 0 ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={percentageChange >= 0 ? theme.success : theme.danger} 
            />
            <Text style={[
              styles.changeText,
              { color: percentageChange >= 0 ? theme.success : theme.danger }
            ]}>
              {Math.abs(percentageChange).toFixed(1)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>Estadísticas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        {/* Selector de periodo */}
        <View style={[styles.periodSelector, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'week' ? { backgroundColor: theme.primary } : { backgroundColor: theme.disabled }
            ]}
            onPress={() => setPeriodType('week')}
          >
            <Text style={[
              styles.periodButtonText,
              { color: periodType === 'week' ? '#fff' : theme.text }
            ]}>
              Semanal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'month' ? { backgroundColor: theme.primary } : { backgroundColor: theme.disabled }
            ]}
            onPress={() => setPeriodType('month')}
          >
            <Text style={[
              styles.periodButtonText,
              { color: periodType === 'month' ? '#fff' : theme.text }
            ]}>
              Mensual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector de vista de comparación */}
        <View style={[styles.comparisonSelector, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.comparisonButton,
              comparisonView === 'current' ? { backgroundColor: theme.primary } : { backgroundColor: theme.disabled }
            ]}
            onPress={() => setComparisonView('current')}
          >
            <Text style={[
              styles.comparisonButtonText,
              { color: comparisonView === 'current' ? '#fff' : theme.text }
            ]}>
              Actual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.comparisonButton,
              comparisonView === 'comparison' ? { backgroundColor: theme.primary } : { backgroundColor: theme.disabled }
            ]}
            onPress={() => setComparisonView('comparison')}
          >
            <Text style={[
              styles.comparisonButtonText,
              { color: comparisonView === 'comparison' ? '#fff' : theme.text }
            ]}>
              Comparación
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de métricas */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Ingresos Totales"
            current={currentStats.totalRevenue}
            previous={previousStats.totalRevenue}
            percentageChange={revenueChange}
            icon="cash"
            color="#27ae60"
            format={(val: number) => `$${val.toLocaleString()}`}
          />
          <MetricCard
            title="Clientes Únicos"
            current={currentStats.uniqueClients}
            previous={previousStats.uniqueClients}
            percentageChange={clientsChange}
            icon="people"
            color="#3498db"
          />
          <MetricCard
            title="Citas Completadas"
            current={currentStats.totalAppointments}
            previous={previousStats.totalAppointments}
            percentageChange={appointmentsChange}
            icon="checkmark-circle"
            color="#9b59b6"
          />
          <MetricCard
            title="Pago Promedio"
            current={currentStats.averageTicket}
            previous={previousStats.averageTicket}
            percentageChange={calculatePercentageChange(
              currentStats.averageTicket,
              previousStats.averageTicket
            )}
            icon="pricetag"
            color="#f39c12"
            format={(val: number) => `$${val.toFixed(0)}`}
          />
        </View>

        {/* Gráfica de Ingresos */}
        {comparisonView === 'comparison' && (
          <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Comparación de Ingresos</Text>
            <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
              {periodType === 'week' ? 'Semana' : 'Mes'} actual vs anterior
            </Text>
            {(currentStats.totalRevenue > 0 || previousStats.totalRevenue > 0) ? (
              <PieChart
                data={revenuePieData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="bar-chart-outline" size={50} color={theme.disabled} />
                <Text style={[styles.emptyChartText, { color: theme.textSecondary }]}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Clientes */}
        {comparisonView === 'comparison' && (
          <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Comparación de Clientes</Text>
            <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
              Clientes únicos atendidos
            </Text>
            {(currentStats.uniqueClients > 0 || previousStats.uniqueClients > 0) ? (
              <PieChart
                data={clientsPieData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="people-outline" size={50} color={theme.disabled} />
                <Text style={[styles.emptyChartText, { color: theme.textSecondary }]}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Citas */}
        {comparisonView === 'comparison' && (
          <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Comparación de Citas</Text>
            <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
              Citas completadas en el periodo
            </Text>
            {(currentStats.totalAppointments > 0 || previousStats.totalAppointments > 0) ? (
              <PieChart
                data={appointmentsPieData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="calendar-outline" size={50} color={theme.disabled} />
                <Text style={[styles.emptyChartText, { color: theme.textSecondary }]}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Servicios Más Populares */}
        <View style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Servicios Más Populares</Text>
          <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>
            {periodType === 'week' ? 'Esta semana' : 'Este mes'}
          </Text>
          {servicesPieData.length > 0 ? (
            <PieChart
              data={servicesPieData}
              width={screenWidth - 60}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Ionicons name="cut-outline" size={50} color={theme.disabled} />
              <Text style={[styles.emptyChartText, { color: theme.textSecondary }]}>Sin servicios completados</Text>
            </View>
          )}
        </View>

        {/* Resumen de rendimiento */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Resumen de Rendimiento</Text>
          <View style={[styles.summaryRow, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Periodo:</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {periodType === 'week' ? 'Semana actual' : 'Mes actual'}
            </Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Tasa de conversión:</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {currentStats.totalAppointments > 0
                ? ((currentStats.totalAppointments / (currentStats.totalAppointments + 5)) * 100).toFixed(1)
                : 0}%
            </Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: theme.divider }]}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Ingreso por cliente:</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              ${currentStats.uniqueClients > 0
                ? (currentStats.totalRevenue / currentStats.uniqueClients).toFixed(0)
                : 0}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Citas por día promedio:</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {periodType === 'week'
                ? (currentStats.totalAppointments / 7).toFixed(1)
                : (currentStats.totalAppointments / 30).toFixed(1)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 5,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  comparisonSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  comparisonButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  comparisonButtonActive: {
  },
  comparisonButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonButtonTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricComparison: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  metricPrevious: {
    fontSize: 11,
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chartCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 13,
    marginBottom: 15,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 14,
    marginTop: 10,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
