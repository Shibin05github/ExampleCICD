import { Image, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { Product } from "../types/ListTypes"

export const RenderList =({index,item}:{item:Product,index:any})=>{
    return (
        <View key={index}>
            <Text variant="titleMedium">{item.title}</Text>
            <Image style={styles.img} source={{uri:item.images.at(0)}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    img:{
        width:100,height:100
    }
})