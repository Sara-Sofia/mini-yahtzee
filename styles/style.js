import { StyleSheet } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from './Metrics';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: verticalScale(70),
    width: horizontalScale(380),

  },
  header: {
    backgroundColor: '#E2BFB3',
    flexDirection: 'row',
    height: verticalScale(60)
  },

  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Alata',
    flex: 1,
    fontSize: 24,
    textAlign: 'center',
    margin: moderateScale(10)
  
  },
  headerIcons: {
  flexDirection: 'row',
  alignSelf: 'center',
  marginLeft: moderateScale(20),
  marginRight: moderateScale(20)
  },

  footer: {
    backgroundColor: '#E2BFB3',
    flexDirection: 'row',
    height: verticalScale(50)
  },

  scoreboard: {
    backgroundColor: '#FEECE2',
    justifyContent: 'space-evenly'
  },

  scoreRow: {
    fontFamily: 'TitilliumWeb-Italic',
    fontSize: moderateScale(15),
    display: 'flex',
    flex: 1
  },
  author: {
    color: '#fff',
    fontFamily: 'TitilliumWeb-Italic',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  row: {
    marginTop: verticalScale(10),
    paddingBottom: moderateScale(2),
    alignSelf:'center',
    fontSize: moderateScale(15)
  },
  pointRow: {
    alignSelf:'center',
  },
  test: {
    fontSize: moderateScale(20)
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
    flexDirection: "row",
    padding: moderateScale(5),
    backgroundColor: "#E2BFB3",
    width: horizontalScale(150),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFBE98',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonText: {
    color:"#FFFFFF",
    fontSize: moderateScale(18),
    fontFamily: 'TitilliumWeb-Bold',
  },
  title: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(6),
    fontSize: moderateScale(18),
    fontFamily: 'TitilliumWeb-Bold',
    color: '#636363',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#FFBE98',
    marginLeft: horizontalScale(5),
    marginRight: horizontalScale(10),

  },
  infoText: {
    marginLeft: horizontalScale(5),
    marginBottom: verticalScale(8),
    fontSize: moderateScale(15),
    fontFamily: 'TitilliumWeb-Italic',
  },
  text: {
    marginLeft: horizontalScale(7),
    marginRight: horizontalScale(12),
    padding: horizontalScale(5),
    fontSize: moderateScale(15),
    textAlign: 'justify',
    fontFamily: 'TitilliumWeb-Regular',
    backgroundColor: '#FEECE2'
  },
  statusText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    fontFamily: 'TitilliumWeb-Italic',
    textAlign: 'center'
  },
  infoIcon: {
    alignSelf: 'center'
  },
});