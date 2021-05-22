CREATE DATABASE IF NOT EXISTS teachingExperiment DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
USE teachingExperiment;
CREATE TABLE IF NOT EXISTS `user`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL,
    `hash` VARCHAR(6000) NOT NULL,
    `avatar` VARCHAR(2000),
    `desc` VARCHAR(200),
    `create_time` timestamp NULL default CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `subject`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `experiments` VARCHAR(6000),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `experiment`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `subject` INT NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `desc` VARCHAR(500),
    `purpose` VARCHAR(500),
    `require` VARCHAR(500),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
CREATE TABLE IF NOT EXISTS `grade`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `user` INT NOT NULL,
    `experiment` INT NOT NULL,
    `score` FLOAT NOT NULL default 0,
    `count` INT NOT NULL default 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO `subject` (`name`, `code`, `experiments`)
VALUES ('数据结构', 'e12021', '1,2,3');
INSERT INTO `experiment` (
        `subject`,
        `name`,
        `desc`,
        `purpose`,
        `require`
    )
VALUES (
        1,
        '冒泡排序',
        '按正确的顺序拼接好流程图并完成其中的填空，点击提交按钮系统会帮您记录分数。若无误则在右侧生成代码，并可单步/连续调试执行',
        '帮助学生们练习代码整体逻辑和代码细节，培养宏观思维和细节，直观的了解冒泡排序的过程，对排序的原理、时间/空间复杂度有更深的了解',
        '请在实验中正确地完成拼接和填空并提交，每位学生可进行10次实验，并记录最高分。实验必须独立完成，只有正确提交后才可进行调试运行，学生们请认真观察和学习冒泡排序的过程'
    );
INSERT INTO `experiment` (
        `subject`,
        `name`,
        `desc`,
        `purpose`,
        `require`
    )
VALUES (
        1,
        '选择排序',
        '按正确的顺序拼接好流程图并完成其中的填空，点击提交按钮系统会帮您记录分数。若无误则在右侧生成代码，并可单步/连续调试执行',
        '帮助学生们练习代码整体逻辑和代码细节，培养宏观思维和细节，直观的了解选择排序的过程，对排序的原理、时间/空间复杂度有更深的了解',
        '请在实验中正确地完成拼接和填空并提交，每位学生可进行10次实验，并记录最高分。实验必须独立完成，只有正确提交后才可进行调试运行，学生们请认真观察和学习选择排序的过程'
    );
INSERT INTO `experiment` (
        `subject`,
        `name`,
        `desc`,
        `purpose`,
        `require`
    )
VALUES (
        1,
        '快速排序',
        '按正确的顺序拼接好流程图并完成其中的填空，点击提交按钮系统会帮您记录分数。若无误则在右侧生成代码，并可单步/连续调试执行',
        '帮助学生们练习代码整体逻辑和代码细节，培养宏观思维和细节，直观的了解快速排序的过程，对排序的原理、时间/空间复杂度有更深的了解',
        '请在实验中正确地完成拼接和填空并提交，每位学生可进行10次实验，并记录最高分。实验必须独立完成，只有正确提交后才可进行调试运行，学生们请认真观察和学习快速排序的过程'
    );