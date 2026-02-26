import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors, radius, shadow } from '../components/theme';
import { getLibraries, getStudent, saveLibraries, addBooking } from '../data/storage';

export default function FullMapScreen({ route, navigation }) {
  const [libraries, setLibraries] = useState(route.params?.libraries || []);
  const [selected, setSelected]   = useState(null);
  const [modal, setModal]         = useState(false);
  const [booked, setBooked]       = useState(false);

  const pinColor = (l) => l.availableSpots === 0 ? 'red' : l.availableSpots <= 3 ? 'orange' : 'green';

  const handleBook = async () => {
    const student = await getStudent();
    const libs    = await getLibraries();
    const updated = libs.map(l => l.id === selected.id ? { ...l, availableSpots: l.availableSpots - 1 } : l);
    await saveLibraries(updated);
    await addBooking({ id: Date.now().toString(), libraryId: selected.id, libraryName: selected.name, building: selected.building, studentName: student?.name || '', erpId: student?.erpId || '', bookedAt: new Date().toISOString() });
    setLibraries(updated);
    setBooked(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Campus Map</Text>
        <View style={{ width: 36 }} />
      </View>

      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{ latitude: 30.2700, longitude: 77.9950, latitudeDelta: 0.018, longitudeDelta: 0.018 }}
      >
        {libraries.map(lib => (
          <Marker key={lib.id} coordinate={{ latitude: lib.lat, longitude: lib.lng }} pinColor={pinColor(lib)} onPress={() => { setSelected(lib); setBooked(false); setModal(true); }}>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{lib.name}</Text>
                <Text style={styles.calloutSpots}>{lib.availableSpots} spots left</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={[styles.legend, shadow]}>
        {[['🟢','Open'], ['🟠','Limited'], ['🔴','Full']].map(([d,l]) => (
          <View key={l} style={styles.legendItem}>
            <Text>{d}</Text><Text style={styles.legendLabel}>{l}</Text>
          </View>
        ))}
      </View>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            {!booked ? (
              <>
                <Text style={styles.sheetTitle}>{selected?.name}</Text>
                <Text style={styles.sheetSub}>{selected?.building}</Text>
                <Text style={styles.sheetSpots}>
                  <Text style={{ fontWeight: '800', fontSize: 32, color: selected?.availableSpots === 0 ? colors.red : colors.green }}>{selected?.availableSpots}</Text>
                  <Text style={{ color: colors.textSub }}> / {selected?.totalSpots} seats available</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.bookBtn, selected?.availableSpots === 0 && { backgroundColor: colors.grayLight }]}
                  onPress={() => selected?.availableSpots > 0 && handleBook()}
                  disabled={selected?.availableSpots === 0}
                >
                  <Text style={styles.bookBtnText}>{selected?.availableSpots === 0 ? 'Library Full' : 'Book This Seat'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}>
                  <Text style={styles.cancelText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 52, marginBottom: 10 }}>🎉</Text>
                <Text style={styles.sheetTitle}>Booking Confirmed!</Text>
                <Text style={styles.sheetSub}>{selected?.name}</Text>
                <TouchableOpacity style={[styles.bookBtn, { marginTop: 20 }]} onPress={() => { setModal(false); navigation.goBack(); }}>
                  <Text style={styles.bookBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar:       { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(10,22,40,0.92)' },
  backBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backText:     { color: 'white', fontSize: 18, fontWeight: '700' },
  topBarTitle:  { color: 'white', fontSize: 17, fontWeight: '700' },
  callout:      { backgroundColor: 'white', borderRadius: 10, padding: 10, minWidth: 140, ...shadow },
  calloutName:  { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  calloutSpots: { fontSize: 12, color: colors.textSub, marginTop: 2 },
  legend:       { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'white', borderRadius: radius.lg, padding: 14, flexDirection: 'row', justifyContent: 'space-around' },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLabel:  { fontSize: 13, color: colors.textSub },
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  handle:       { width: 40, height: 4, backgroundColor: colors.grayLight, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle:   { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  sheetSub:     { fontSize: 13, color: colors.textSub, marginBottom: 16 },
  sheetSpots:   { marginBottom: 20 },
  bookBtn:      { backgroundColor: colors.navy, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  bookBtnText:  { color: 'white', fontWeight: '700', fontSize: 16 },
  cancelBtn:    { paddingVertical: 10, alignItems: 'center' },
  cancelText:   { color: colors.textSub },
});
