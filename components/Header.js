import { Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/style';
import { horizontalScale, moderateScale, verticalScale } from '../styles/Metrics';

export default Header = () => {
    return (
        <View style={styles.header}>
            <FontAwesome5 name="dice" size={moderateScale(24)} color="#365486" style={styles.headerIcons} />
            <Text style={styles.headerTitle}>MINI-YAHTZEE</Text>
            <FontAwesome5 name="dice" size={moderateScale(24)} color="#365486" style={styles.headerIcons}  />
        </View>
    )
}