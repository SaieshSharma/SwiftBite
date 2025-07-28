import {View, Text, FlatList, TouchableOpacity, Platform} from 'react-native'
import {Category} from "@/type";
import {router, useLocalSearchParams} from "expo-router";
import {useState, useEffect} from "react";
import cn from "clsx";

const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || '');

    // Update active filter when searchParams change (from navigation)
    useEffect(() => {
        if (searchParams.category) {
            // Find the category by name and set its ID as active
            const matchingCategory = categories?.find(cat => 
                cat.name.toLowerCase() === (searchParams.category as string).toLowerCase()
            );
            if (matchingCategory) {
                setActive(matchingCategory.$id);
            }
        } else {
            setActive('all');
        }
    }, [searchParams.category, categories]);

    const handlePress = (id: string, name: string) => {
        setActive(id);

        if(id === 'all') {
            router.setParams({ category: undefined });
        } else {
            // Use the category name for filtering
            router.setParams({ category: name });
        }
    };

    const filterData: (Category | { $id: string; name: string })[] = categories
        ? [{ $id: 'all', name: 'All' }, ...categories]
        : [{ $id: 'all', name: 'All' }]

    return (
        <FlatList
            data={filterData}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-x-2 pb-3"
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.$id}
                    className={cn('filter', active === item.$id ? 'bg-amber-500' : 'bg-white')}
                    style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787'} : {}}
                    onPress={() => handlePress(item.$id, item.name)}
                >
                    <Text className={cn('body-medium', active === item.$id ? 'text-black' : 'text-black')}>{item.name}</Text>
                </TouchableOpacity>
            )}
        />
    )
}
export default Filter