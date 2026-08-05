import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Pressable, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
// Match the max width we set in App.tsx for web, so it doesn't stretch across a 4K monitor
const PLAYER_WIDTH = Math.min(width, 450); 
const PLAYER_HEIGHT = PLAYER_WIDTH * (9 / 16); // Perfect 16:9 aspect ratio

interface Props {
  videoId: string;
  visible: boolean;
  onClose: () => void;
}

export function TrailerPlayer({ videoId, visible, onClose }: Props) {
  const [playing, setPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      onClose(); // Auto close when trailer ends
    }
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Pressable style={styles.closeArea} onPress={onClose} />
        
        <View style={styles.playerContainer}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
          
          {!isReady && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#00C4FF" />
            </View>
          )}

          <YoutubePlayer
            width={PLAYER_WIDTH}
            height={PLAYER_HEIGHT}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            onReady={() => setIsReady(true)}
          />
        </View>
        
        <Pressable style={styles.closeArea} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center', // Center the player on wide screens
  },
  closeArea: {
    flex: 1,
    width: '100%',
  },
  playerContainer: {
    width: PLAYER_WIDTH,
    backgroundColor: '#000',
    position: 'relative',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    zIndex: 10,
    padding: 8,
  }
});
