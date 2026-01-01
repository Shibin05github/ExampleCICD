import { useEffect, useState } from "react"
import { Text } from "react-native-paper"
import { FlatList, RefreshControl, StyleSheet, View } from "react-native"
import { ListApiResponseType } from "../types/ListTypes"
import { RenderList } from "../components/RenderItems"
import { getProducts } from "../api/ListService"

export const ListScreen = () => {
    const [listItems, setlistItems] = useState<ListApiResponseType>()
    const [pageLimit, setPageLimit] = useState(10)
    const [isRefreshing,setIsRefreshing ] = useState(false)

    const getItems = async () => {
        const res = await getProducts(pageLimit)

        setlistItems(prev => {
            if (!prev) return res
            return {
                ...res,
                products: [...prev.products, ...res.products],
            }
        })
    }

    useEffect(() => {
        getItems();
    }, [pageLimit])

    const handleOnReachedEnd = () => {
        setPageLimit((prev) => (prev + 10))
    }

    return (
        <View style={styles.container}>
            <Text variant="bodyLarge">List</Text>
            <FlatList
                data={listItems?.products}
                renderItem={RenderList}
                onEndReached={handleOnReachedEnd}
                refreshControl={<RefreshControl refreshing={isRefreshing}/>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    }
})