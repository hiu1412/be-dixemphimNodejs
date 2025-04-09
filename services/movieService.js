import Movie from '../models/movie.js';

//create
const createMovie = async (data) =>{
    try{
    const movie = new Movie(data);
    return await movie.save();
    }catch(error)
    {
        throw new Error("Lỗi khi tạo phim: " + error.message);
    }
}

//get list all
const getAllMovies = async (page = 1, limit = 25) => {
    try {
        const movies = await Movie.find()
            .sort({ createdAt: -1 }) // Sắp xếp theo createdAt mới nhất
            .skip((page - 1) * limit) // Bỏ qua các bản ghi trước đó
            .limit(limit) // Giới hạn số lượng bản ghi trả về
            .populate('showtime');
        return movies;
    } catch (error) {
        throw new Error("Lỗi khi lấy danh sách phim: " + error.message);
    }
};


//get id
const getMovie = async(id)=>{
    try{
        const movie = await Movie.findById(id).populate('showtime');
        if(!movie) throw new Error("Phim khong ton tai" + error.message);
        return movie;
   }catch(errror)
   {
        throw new Error("Loi khi lay phim: " + error.message);
   }
};

//update 
const updateMovie = async(id,data) => {
    try{
        const movie = await Movie.findByIdAndUpdate(id, data, { new: true });
        if (!movie) throw new Error("Phim không tồn tại");
        return movie;
    }catch(error)
    {
        throw new Error("Lỗi khi cập nhật phim: " + error.message);
    }
};

//delete
const deleteMovie = async(id)=>{
    try{
        const movie = await Movie.findByIdAndDelete(id);
        if(!movie) throw new Error("Phim không tồn tại");
        return movie;
    }catch(errror)
    {
        throw new Error("Lỗi khi xóa phim: " + error.message);
    }
};

export { createMovie, getAllMovies, getMovie, updateMovie, deleteMovie };




