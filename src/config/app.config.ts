export const EnvConfiguration = () => ({
    stage: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-pokedex',
    port: +process.env.PORT || 3000,
    limitPagination: 10,
})