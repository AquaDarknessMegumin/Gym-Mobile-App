import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

interface Props {
  user: { name: string; timeAgo: string };
  title: string;
  stats: { time: string; volume: string; bpm: number };
  exercises: { name: string; sets: string }[];
}

const AVATAR_COLORS = ['#6338AB', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const FeedCard = ({ user, title, stats, exercises }: Props) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 20));

  const avatarColor = AVATAR_COLORS[user.name.length % AVATAR_COLORS.length];
  const initials = user.name.slice(0, 2).toUpperCase();

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={[Typography.body, { fontWeight: '700' }]}>{user.name}</Text>
          <Text style={[Typography.bodySecondary, { fontSize: 12 }]}>{user.timeAgo}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Title & Stats */}
      <View style={styles.content}>
        <Text style={[Typography.header2, styles.title]}>{title}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Ionicons name="time-outline" size={16} color={Colors.primary} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statValue}>{stats.time}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
          <View style={styles.statCol}>
            <Ionicons name="barbell-outline" size={16} color="#22C55E" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statValue}>{stats.volume}</Text>
              <Text style={styles.statLabel}>Volume</Text>
            </View>
          </View>
        </View>

        {/* Exercises Preview */}
        <View style={styles.exercisesList}>
          {exercises.map((ex, index) => (
            <View key={index} style={styles.exerciseItem}>
              <View style={styles.dot} />
              <Text style={styles.exerciseText}>
                <Text style={{ fontWeight: '600' }}>{ex.name}</Text> • {ex.sets}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={22} 
            color={liked ? "#EF4444" : Colors.textSecondary} 
          />
          <Text style={[styles.actionText, liked && { color: "#EF4444" }]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="share-social-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden', marginBottom: 20, borderRadius: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { 
    width: 44, height: 44, borderRadius: 22, 
    alignItems: 'center', justifyContent: 'center', 
    marginRight: 12 
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  moreBtn: { padding: 4 },
  content: { paddingHorizontal: 16, paddingBottom: 16 },
  title: { marginBottom: 16, fontSize: 18 },
  statsRow: { flexDirection: 'row', gap: 24, marginBottom: 20 },
  statCol: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  exercisesList: { 
    backgroundColor: 'rgba(242, 242, 247, 0.5)', 
    borderRadius: 12, 
    padding: 12 
  },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginRight: 8 },
  exerciseText: { fontSize: 13, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  actionRow: { flexDirection: 'row', padding: 12, justifyContent: 'space-between' },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
  actionText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
});
