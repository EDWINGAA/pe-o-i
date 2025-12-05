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
import { useAuth, useAppointments } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

type PeriodType = 'week' | 'month';
type ComparisonType = 'current' | 'previous' | 'comparison';

export default function BarberStatisticsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { getBarberAppointments } = useAppointments();
  
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
      name: 'Ingresos actuales',
      population: currentStats.totalRevenue,
      color: '#27ae60',
      legendFontColor: '#2c3e50',
      legendFontSize: 12,
    },
    {
      name: 'Ingresos anteriores',
      population: previousStats.totalRevenue,
      color: '#95a5a6',
      legendFontColor: '#2c3e50',
      legendFontSize: 12,
    },
  ];

  // Datos para gráfica de clientes (pastel)
  const clientsPieData = [
    {
      name: 'Clientes actuales',
      population: currentStats.uniqueClients,
      color: '#3498db',
      legendFontColor: '#2c3e50',
      legendFontSize: 12,
    },
    {
      name: 'Clientes anteriores',
      population: previousStats.uniqueClients,
      color: '#95a5a6',
      legendFontColor: '#2c3e50',
      legendFontSize: 12,
    },
  ];

  // Datos para gráfica de citas (pastel)
  const appointmentsPieData = [
    {
      name: 'Citas actuales',
      population: currentStats.totalAppointments,
      color: '#9b59b6',
      legendFontColor: '#2c3e50',
      legendFontSize: 12,
    },
    {
      name: 'Citas anteriores',
      population: previousStats.totalAppointments,
      color: '#95a5a6',
      legendFontColor: '#2c3e50',
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
    color: ['#e74c3c', '#f39c12', '#1abc9c', '#34495e'][index],
    legendFontColor: '#2c3e50',
    legendFontSize: 11,
  }));

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
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
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={[styles.metricValue, { color }]}>{format(current)}</Text>
      {comparisonView !== 'current' && (
        <View style={styles.metricComparison}>
          <Text style={styles.metricPrevious}>
            Anterior: {format(previous)}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons 
              name={percentageChange >= 0 ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={percentageChange >= 0 ? '#27ae60' : '#e74c3c'} 
            />
            <Text style={[
              styles.changeText,
              { color: percentageChange >= 0 ? '#27ae60' : '#e74c3c' }
            ]}>
              {Math.abs(percentageChange).toFixed(1)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Selector de periodo */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'week' && styles.periodButtonActive
            ]}
            onPress={() => setPeriodType('week')}
          >
            <Text style={[
              styles.periodButtonText,
              periodType === 'week' && styles.periodButtonTextActive
            ]}>
              Semanal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              periodType === 'month' && styles.periodButtonActive
            ]}
            onPress={() => setPeriodType('month')}
          >
            <Text style={[
              styles.periodButtonText,
              periodType === 'month' && styles.periodButtonTextActive
            ]}>
              Mensual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector de vista de comparación */}
        <View style={styles.comparisonSelector}>
          <TouchableOpacity
            style={[
              styles.comparisonButton,
              comparisonView === 'current' && styles.comparisonButtonActive
            ]}
            onPress={() => setComparisonView('current')}
          >
            <Text style={[
              styles.comparisonButtonText,
              comparisonView === 'current' && styles.comparisonButtonTextActive
            ]}>
              Actual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.comparisonButton,
              comparisonView === 'comparison' && styles.comparisonButtonActive
            ]}
            onPress={() => setComparisonView('comparison')}
          >
            <Text style={[
              styles.comparisonButtonText,
              comparisonView === 'comparison' && styles.comparisonButtonTextActive
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
            title="Ticket Promedio"
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
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Comparación de Ingresos</Text>
            <Text style={styles.chartSubtitle}>
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
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="bar-chart-outline" size={50} color="#bdc3c7" />
                <Text style={styles.emptyChartText}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Clientes */}
        {comparisonView === 'comparison' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Comparación de Clientes</Text>
            <Text style={styles.chartSubtitle}>
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
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="people-outline" size={50} color="#bdc3c7" />
                <Text style={styles.emptyChartText}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Citas */}
        {comparisonView === 'comparison' && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Comparación de Citas</Text>
            <Text style={styles.chartSubtitle}>
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
                absolute
              />
            ) : (
              <View style={styles.emptyChart}>
                <Ionicons name="calendar-outline" size={50} color="#bdc3c7" />
                <Text style={styles.emptyChartText}>Sin datos disponibles</Text>
              </View>
            )}
          </View>
        )}

        {/* Gráfica de Servicios Más Populares */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Servicios Más Populares</Text>
          <Text style={styles.chartSubtitle}>
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
              <Ionicons name="cut-outline" size={50} color="#bdc3c7" />
              <Text style={styles.emptyChartText}>Sin servicios completados</Text>
            </View>
          )}
        </View>

        {/* Resumen de rendimiento */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Rendimiento</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Periodo:</Text>
            <Text style={styles.summaryValue}>
              {periodType === 'week' ? 'Semana actual' : 'Mes actual'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tasa de conversión:</Text>
            <Text style={styles.summaryValue}>
              {currentStats.totalAppointments > 0
                ? ((currentStats.totalAppointments / (currentStats.totalAppointments + 5)) * 100).toFixed(1)
                : 0}%
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ingreso por cliente:</Text>
            <Text style={styles.summaryValue}>
              ${currentStats.uniqueClients > 0
                ? (currentStats.totalRevenue / currentStats.uniqueClients).toFixed(0)
                : 0}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Citas por día promedio:</Text>
            <Text style={styles.summaryValue}>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
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
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    marginBottom: 15,
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
    backgroundColor: '#2c3e50',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  comparisonSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
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
    backgroundColor: '#3498db',
  },
  comparisonButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
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
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
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
    color: '#7f8c8d',
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
    borderTopColor: '#ecf0f1',
  },
  metricPrevious: {
    fontSize: 11,
    color: '#95a5a6',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  emptyChart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
